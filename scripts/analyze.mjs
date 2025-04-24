// scripts/analyze.mjs

'use strict';

import { existsSync, statSync, readdirSync } from 'node:fs';
import { resolve, join, relative } from 'node:path';

const timestamp = () => ( new Date() ).toLocaleTimeString();

const log = ( msg ) => {

    console.log( `\x1b[36m[${ timestamp() }]\x1b[0m ${msg}` );

};

const analyze = () => {

    log( `Analyzing build artifacts …` );

    const packagesRoot = resolve( 'packages' );
    const analyzeResults = [];

    const analyzeDist = ( pkgPath ) => {

        const distPath = join( pkgPath, 'dist' );

        if ( ! existsSync( distPath ) ) return null;

        let fileCount = 0;
        let totalSize = 0;

        const walk = ( dir ) => {

            for ( const entry of readdirSync( dir ) ) {

                const fullPath = join( dir, entry );

                const stat = statSync( fullPath );

                if ( stat.isDirectory() ) {

                    walk( fullPath );

                } else {

                    fileCount++;

                    totalSize += stat.size;

                }

            }

        };

        walk( distPath );

        return {
            package: relative( packagesRoot, pkgPath ),
            files: fileCount,
            size: totalSize
        };

    };

    const walkPackages = ( dir ) => {

        for ( const entry of readdirSync( dir ) ) {

            const full = join( dir, entry );

            if ( statSync( full ).isDirectory() ) {

                const result = analyzeDist( full );

                if ( result ) analyzeResults.push( result );

                walkPackages( full );

            }

        }

    };

    walkPackages( packagesRoot );

    if ( analyzeResults.length === 0 ) {

        log( `No build artifacts found in /dist folders.` );

        return;

    }

    log( `Build artifact summary:\n` );

    analyzeResults.forEach( ( { package: pkg, files, size } ) => {

        console.log( `  - ${pkg}: ${files} file(s), ${ ( size / 1024 ).toFixed( 1 ) } KB` );

    } );

    console.log( `\nTotal: ${ (
        analyzeResults.reduce( ( sum, r ) => sum + r.files, 0 )
    ) } files, ${ (
        analyzeResults.reduce( ( sum, r ) => sum + r.size, 0 ) / ( 1024 * 1024 )
    ).toFixed( 2 ) } MB\n` );

};

analyze();