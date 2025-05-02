// scripts/build.mjs

'use strict';

import { execSync } from 'node:child_process';
import { existsSync, rmSync, appendFileSync, readFileSync } from 'node:fs';
import { resolve, join, sep } from 'node:path';

// config

const TSCONFIG = 'tsconfig.build.json';
const ROOT = resolve();

const PATHS = ( JSON.parse(
    readFileSync( resolve( ROOT, TSCONFIG ), 'utf-8' )
).references || [] ).map(
    ( ref ) => resolve( ROOT, ref.path )
);

const FLAGS = {
    ci: false, force: false, cleanOnly: false, noClean: false,
    only: null, parallel: false, dryRun: false, watch: false,
    noise: true, logFile: null, listOnly: false
};

// utils

const parseArgs = ( args ) => args.forEach( ( arg, i ) => {

    if ( arg.startsWith( '--' ) ) {

        FLAGS[ arg.slice( 2 ) ] = [ '--log', '--only' ].includes( arg )
            ? args[ i + 1 ]
            : true;

    }

} );

const delay = ( ms ) => new Promise ( ( res ) => setTimeout( res, ms ) );

const toPosix = ( p ) => p.split( sep ).join( '/' );

const timestamp = () => ( new Date() ).toLocaleTimeString();

const log = ( msg ) => {

    const ts = `[${ timestamp() }]`;

    ( FLAGS.logFile && appendFileSync( FLAGS.logFile, `${ts} ${msg}\n` ) );

    ( FLAGS.noise && console.log( `\x1b[36m${ts}\x1b[0m ${msg}` ) );

};

const logPath = ( path ) => toPosix( path ).replace( toPosix( ROOT ) + '/', '' );

const logConfig = ( path ) => console.log( `  → ${ logPath( path ) }` );

const resolveTsconfig = ( path ) => join( path, 'tsconfig.json' );

// build steps

const clean = () => {

    log( `🔄 Cleaning artifacts …` );

    const paths = PATHS.flatMap( ( pkg ) => [
        join( pkg, 'tsconfig.tsbuildinfo' ),
        join( pkg, 'dist' )
    ] ).filter( existsSync );

    for ( const path of paths ) {

        rmSync( path, { recursive: true, force: true } );

    }

    log( `✅ Cleanup finished successfully` );

};

const verifyConfigs = () => {

    log( `🔄 Verifying tsconfig files …` );

    const configs = PATHS.map( resolveTsconfig ).filter(
        ( config ) => ! existsSync( config )
    );

    if ( configs.length ) {

        throw new Error ( `❌ Config(s) not found: ${ configs.join( ', ' ) }` );

    }

    log( `✅ Verified tsconfig files successfully` );

};

const list = () => {

    log( `📦 Referenced packages:` );

    PATHS.forEach( logConfig );

    log( `✅ Found ${ PATHS.length } package(s)` );

};

const build = async () => {

    log( FLAGS.only
        ? `📦 Building single package: ${ FLAGS.only }`
        : `📦 Building ${ FLAGS.parallel ? 'all packages (parallel)' : 'all packages (sequential)' } …`
    );

    const makeCommand = ( config ) => [
        'npx tsc -b', config,
        FLAGS.force && '--force',
        FLAGS.noise && '--verbose',
        FLAGS.watch && '--watch'
    ].filter( Boolean ).join( ' ' );

    if ( FLAGS.only ) {

        const configPath = join( ROOT, 'packages', FLAGS.only, 'tsconfig.json' );

        if ( ! existsSync( configPath ) ) {

            throw new Error ( `❌ tsconfig.json not found for: ${ FLAGS.only }` );

        }

        if ( ! FLAGS.dryRun ) {

            execSync( makeCommand( configPath ), { stdio: 'inherit' } );

        }

    } else if ( FLAGS.parallel ) {

        const configs = PATHS.map( resolveTsconfig );

        configs.forEach( logConfig );

        if ( ! FLAGS.dryRun ) {

            const results = await Promise.allSettled( configs.map( ( cfg ) => {

                try {

                    execSync( makeCommand( cfg ), { stdio: 'inherit' } );

                    return Promise.resolve();

                } catch ( err ) {

                    log( `❌ Failed: ${ logPath( cfg ) }` );

                    return Promise.reject( err );

                }

            } ) );

            const failures = results.filter( ( r ) => r.status === 'rejected' );

            if ( failures.length ) {

                throw new Error ( `❌ Build failed for ${ failures.length } package(s)` );

            }

        }

    } else {

        if ( ! FLAGS.dryRun ) {

            execSync( makeCommand( 'tsconfig.build.json' ), { stdio: 'inherit' } );

        }

    }

    log( `✅ Build finished successfully` );

};

// main loop

const main = async () => {

    const [ , , ...args ] = process.argv;

    parseArgs( args );

    log( `🛠️  Starting build script in ${ toPosix( ROOT ) }` );

    Object.assign( FLAGS, FLAGS.ci ? {
        force: true, cleanOnly: false, noClean: true, watch: false,
        parallel: false, noise: false, logFile: null
    } : {} );

    ( FLAGS.listOnly && ( list() || true ) ) || ( ! FLAGS.noClean && clean() ) || ( ! FLAGS.cleanOnly && ( async () => {

        log( `⏳ Waiting briefly before build …` );
        await delay( 1000 );

        verifyConfigs();

        await build();

        if ( FLAGS.watch ) {

            log( `👀 Watching for changes (restart on config changes required) …` );

        }

    } )() );

};

main().catch( ( err ) => {

    console.error( `\n❌ Build failed:`, err.message );
    process.exit( 1 );

} );