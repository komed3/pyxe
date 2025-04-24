// scripts/build.mjs

import { execSync } from 'node:child_process';
import { existsSync, readdirSync, statSync } from 'node:fs';
import { resolve, join } from 'node:path';

const TIMEOUT = process.platform === 'win32' ? 'timeout 1' : 'sleep 1';
const RIMRAF = 'rimraf --glob';
const TSC = 'npx tsc -b';

const DIST_PATHS = [
  'packages/*/dist',
  'packages/*/*/dist',
  'packages/*/*/*/dist'
];

const TSBUILDINFO_GLOB = 'packages/*/tsconfig.tsbuildinfo';

let noise = true;

const log = ( msg ) => {

    if ( noise ) {

        console.log( `\x1b[90m[build]\x1b[0m ${ msg }` );

    }

};

const parseArgs = ( args ) => {

    const flags = {
        force: false,
        ci: false,
        cleanOnly: false,
        only: null
    };

    for ( let i = 0; i < args.length; i++ ) {

        const arg = args[ i ];

        switch ( arg ) {

            case '--ci':
                flags.ci = true;
                break;

            case '--force':
                flags.force = true;
                break;

            case '--clean':
                flags.cleanOnly = true;
                break;

            case '--only':
                flags.only = args[ i + 1 ];
                i++;
                break;

        }

    }

    return flags;

};

const findAllTsconfigs = ( dir = 'packages' ) => {

    const tsconfigs = [ resolve( 'tsconfig.build.json' ) ];

    const walk = ( current ) => {

        for ( const entry of readdirSync( current ) ) {

            const full = join( current, entry );

            if ( statSync( full ).isDirectory() ) {

                walk( full );

            } else if ( entry === 'tsconfig.json' ) {

                tsconfigs.push( full );

            }

        }

    };

    walk( resolve( dir ) );

    return tsconfigs;

};

const clean = () => {

    log( `Cleaning artifacts …` );

    execSync( `${ RIMRAF } ${ DIST_PATHS.join( ' ' ) } ${ TSBUILDINFO_GLOB }`, {
        stdio: 'inherit'
    } );

    log( `✅ Cleanup finished successfully` );

};

const verifyConfigs = () => {

    log( `Verifying tsconfig files …` );

    const configs = findAllTsconfigs();

    for ( const config of configs ) {

        if ( ! existsSync( config ) ) {

            throw new Error( `Config not found: ${ config }` );

        }

    }

    log( `✅ Verified ${ configs.length } tsconfig files successfully` );

};

const build = ( force = false, only = null ) => {

    log( `Building packages …` );

    const options = `${ ( force ? '--force' : '' ) } ${ ( noise ? '--verbose' : '' ) }`;

    if ( only ) {

        const configPath = `packages/${only}/tsconfig.json`;

        if ( ! existsSync( configPath ) ) {

            throw new Error( `No tsconfig.json found for package: ${only}` );

        }

        log( `Building only package: ${only} …` );

        execSync( `${ TSC } -b ${ configPath } ${ options }`, {
            stdio: 'inherit'
        } );

    } else {

        log( `Building all packages …` );

        execSync( `${ TSC } -b tsconfig.build.json ${ options }`, {
            stdio: 'inherit'
        } );

    }

    log( `✅ Build finished successfully` );

};

const main = async () => {

    const [ , , ...args ] = process.argv;
    const flags = parseArgs( args );

    noise = !flags.ci;

    clean();

    if ( ! flags.cleanOnly ) {

        log( `Waiting briefly before build …` );

        execSync( TIMEOUT, { stdio: 'inherit' } );

        verifyConfigs();

        build( flags.force, flags.only );

    }

};

main().catch( ( err ) => {

    console.error( `\n❌ Build failed:`, err.message );

    process.exit( 1 );

} );