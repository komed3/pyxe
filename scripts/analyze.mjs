// scripts/analyze.mjs

'use strict';

import { existsSync, statSync, readdirSync } from 'node:fs';
import { resolve, join, relative, sep } from 'node:path';

const ROOT = resolve();
const PACKAGES = join( ROOT, 'packages' );

// utils

const toPosix = ( p ) => p.split( sep ).join( '/' );

const logPath = ( p ) => toPosix( p ).replace( toPosix( ROOT ) + '/', '' );

const timestamp = () => ( new Date() ).toLocaleTimeString();

const log = ( msg ) => console.log( `\x1b[36m[${ timestamp() }]\x1b[0m ${msg}` );

// recursive gather

const analyzeDist = ( pkgPath ) => {

    const distPath = join( pkgPath, 'dist' );

    if ( ! existsSync( distPath ) ) return null;

    let fileCount = 0;
    let totalSize = 0;

    const walk = ( dir ) => {

        for ( const entry of readdirSync( dir ) ) {

            const full = join( dir, entry );
            const stat = statSync( full );

            stat.isDirectory() ? walk( full ) : (
                totalSize += stat.size,
                fileCount++
            );

        }

    };

    walk( distPath );

    return {
        package: relative( PACKAGES, pkgPath ),
        files: fileCount, size: totalSize,
    };

};

const analyzePackages = ( dir ) => {

    const results = [];

    const walk = ( curr ) => {

        for ( const entry of readdirSync( curr ) ) {

            const full = join( curr, entry );

            if ( statSync( full ).isDirectory() ) {

                const result = analyzeDist( full );

                if ( result ) results.push( result );

                walk( full );

            }

        }

    };

    walk( dir );

    return results;

};

// main loop

const main = () => {

    log( `Analyzing build artifacts …` );

    const results = analyzePackages( PACKAGES );

    if ( results.length === 0 ) {

        log( `No build artifacts found in /dist folders.` );

        return;

    }

    log( `Build artifact summary:\n` );

    for ( const { package: pkg, files, size } of results ) {

        console.log( `  → ${ logPath( pkg ) }: ${files} file(s), ${ ( size / 1024 ).toFixed( 1 ) } KB` );

    }

    console.log( `\nTotal: ${ (
        results.reduce( ( sum, r ) => sum + r.files, 0 )
    ) } files, ${ (
        results.reduce( ( sum, r ) => sum + r.size, 0 ) / ( 1024 * 1024 )
    ).toFixed( 2 ) } MB\n` );

};

main();