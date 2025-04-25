// scripts/build.mjs

'use strict';

import { execSync } from 'node:child_process';
import { existsSync, readdirSync, statSync, appendFileSync, rmSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { globSync } from 'glob';

const TSBUILDINFO_GLOB = 'packages/*/tsconfig.tsbuildinfo';

const DIST_PATHS = [
    'packages/*/dist',
    'packages/*/*/dist',
    'packages/*/*/*/dist'
];

const flags = {
    ci: false, force: false,
    cleanOnly: false, noClean: false,
    only: null, parallel: false,
    dryRun: false, watch: false,
    noise: true, logFile: null
};

const parseArgs = ( args ) => {

    args.map( ( arg, i ) => {

        switch ( arg ) {

            case '--ci': flags.ci = true; break;
            case '--log': flags.logFile = args[ i + 1 ]; break;
            case '--force': flags.force = true; break;
            case '--clean': flags.cleanOnly = true; break;
            case '--no-clean': flags.noClean = true; break;
            case '--only': flags.only = args[ i + 1 ]; break;
            case '--dry-run': flags.dryRun = true; break;
            case '--parallel': flags.parallel = true; break;
            case '--watch': flags.watch = true; break;

        }

    } );

};

const timestamp = () => ( new Date() ).toLocaleTimeString();

const log = ( msg ) => {

    const ts = `[${ timestamp() }]`;

    if ( flags.noise ) {

        console.log( `\x1b[36m${ts}\x1b[0m ${msg}` );

    }

    if ( flags.logFile ) {

        appendFileSync( flags.logFile, `${ts} ${msg}\n` );

    }

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

    for ( const path of [
        ...DIST_PATHS.flatMap( ( pattern ) => globSync( pattern, { absolute: true } ) ),
        ...globSync( TSBUILDINFO_GLOB, { absolute: true } )
    ] ) {

        if ( existsSync( path ) ) {

            rmSync( path, { recursive: true, force: true } );

        }

    }

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

const build = async ( flags ) => {

    const { force, only, watch, parallel, dryRun, noise } = flags;

    log( `Building packages …` );

    const cmd = ( config ) => `npx tsc -b -b ${ config } ${ [
        force && '--force', noise && '--verbose', watch && '--watch'
    ].filter( Boolean ).join( ' ' ) }`;

    if ( only ) {

        const configPath = `packages/${only}/tsconfig.json`;

        if ( ! existsSync( configPath ) ) {

            throw new Error( `No tsconfig.json found for package: ${only}` );

        }

        log( `Building only package: ${only} …` );

        if ( ! dryRun ) {

            execSync( cmd( configPath ), { stdio: 'inherit' } );

        }

    } else {

        log( `Building all packages …` );

        if ( parallel ) {

            const configs = findAllTsconfigs();

            for ( const cfg of configs ) {

                log( `→ ${cfg}` );

            }

            if ( ! dryRun ) {

                await Promise.all(

                    configs.map( ( cfg ) => (

                        new Promise ( ( resolve, reject ) => {

                            try {

                                execSync( cmd( cfg ), { stdio: 'inherit' } );

                                resolve();

                            } catch ( err ) {

                                reject( err );

                            }

                        } )

                    ) )

                );

            }

        } else {

            if ( ! dryRun ) {

                execSync( cmd( 'tsconfig.build.json' ), { stdio: 'inherit' } );

            }

        }

    }

    log( `✅ Build finished successfully` );

};

const main = async () => {

    const [ , , ...args ] = process.argv;

    parseArgs( args );

    if ( flags.ci ) {

        flags.force = true;
        flags.cleanOnly = false;
        flags.noClean = true;
        flags.watch = false;
        flags.parallel = false;
        flags.noise = false;
        flags.logFile = null;

    }

    if ( ! flags.noClean ) {

        clean();

    }

    if ( ! flags.cleanOnly ) {

        log( `Waiting briefly before build …` );

        await new Promise( resolve => setTimeout( resolve, 1000 ) );

        verifyConfigs();

        await build( flags );

        if ( flags.watch ) {

            log( `Watching for changes (manual restart required on config changes) …` );

        }

    }

};

main().catch( ( err ) => {

    console.error( `\n❌ Build failed:`, err.message );

    process.exit( 1 );

} );
