// scripts/build.mjs

'use strict';

import { execSync } from 'node:child_process';
import { existsSync, readdirSync, statSync, appendFileSync } from 'node:fs';
import { resolve, join } from 'node:path';

const DIST_PATHS = [
    'packages/*/dist',
    'packages/*/*/dist',
    'packages/*/*/*/dist'
];

const TSBUILDINFO_GLOB = 'packages/*/tsconfig.tsbuildinfo';

var noise = true;
var logFile = null;

const timestamp = () => ( new Date() ).toLocaleTimeString();

const log = ( msg ) => {

    const ts = `[${ timestamp() }]`;

    if ( noise ) {

        console.log( `\x1b[36m${ts}\x1b[0m ${msg}` );

    }

    if ( logFile ) {

        appendFileSync( logFile, `${ts} ${msg}\n` );

    }

};

const parseArgs = ( args ) => {

    return args.reduce( ( flags, arg, i ) => {

        switch ( arg ) {

            case '--ci': flags.ci = true; break;
            case '--force': flags.force = true; break;
            case '--clean': flags.cleanOnly = true; break;
            case '--only': flags.only = args[ i + 1 ]; break;
            case '--watch': flags.watch = true; break;
            case '--parallel': flags.parallel = true; break;
            case '--dry-run': flags.dryRun = true; break;
            case '--no-clean': flags.noClean = true; break;
            case '--strict': flags.strict = true; break;
            case '--log': flags.logFile = args[ i + 1 ]; break;

        }

        return flags;

    }, {
        force: false, ci: false, cleanOnly: false, only: null,
        watch: false, parallel: false, dryRun: false,
        noClean: false, strict: false, logFile: null
    } );

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

    execSync( `rimraf --glob ${ DIST_PATHS.join( ' ' ) } ${ TSBUILDINFO_GLOB }`, {
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

const build = async ( flags ) => {

    const { force, only, watch, parallel, dryRun, strict } = flags;

    log( `Building packages …` );

    const cmd = ( config ) => `npx tsc -b -b ${ config } ${ [
        force && '--force', noise && '--verbose',
        watch && '--watch', strict && '--strict'
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
    const flags = parseArgs( args );

    noise = ! flags.ci;
    logFile = flags.logFile;

    if ( ! flags.noClean ) {

        clean();

    }

    if ( ! flags.cleanOnly ) {

        log( `Waiting briefly before build …` );

        execSync( process.platform === 'win32' ? 'timeout 1' : 'sleep 1', { stdio: 'inherit' } );

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
