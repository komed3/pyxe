'use strict';

import type { ColorSpaceName, ConversionHandler } from '@pyxe/types';
import { ColorSpace } from './ColorSpace.js';
import { conversionGraphRegistry } from './registry/ConversionGraphRegistry.js';
import { PyxeError } from './services/PyxeError.js';

const cache: Map<string, ColorSpaceName[] | null> = new Map ();

export class ConversionGraph {

    public static flush () : void {

        cache.clear();

    }

    public static targets (
        source: ColorSpaceName
    ) : ColorSpaceName[] {

        return conversionGraphRegistry.targets( source );

    }

    public static findPath (
        source: ColorSpaceName,
        target: ColorSpaceName
    ) : ColorSpaceName[] | null {

        if ( source === target ) return [ source ];

        const cacheKey = `${source}::${target}`;

        if ( cache.has( cacheKey ) ) {

            return cache.get( cacheKey )!;

        }

        const visited: Set<ColorSpaceName> = new Set ();
        const queue: [ ColorSpaceName, ColorSpaceName[] ][] = [
            [ source, [ source ] ]
        ];

        while ( queue.length > 0 ) {

            const [ current, path ] = queue.shift()!;

            if ( visited.has( current ) ) continue;

            visited.add( current );

            for ( const next of conversionGraphRegistry.targets( current ) ) {

                if ( visited.has( next ) ) continue;

                const newPath = [ ...path, next ];

                if ( next === target ) {

                    cache.set( cacheKey, newPath );

                    return newPath;

                }

                queue.push( [ next, newPath ] );

            }

        }

        cache.set( cacheKey, null );

        return null;

    }

    public static hasPath (
        source: ColorSpaceName,
        target: ColorSpaceName
    ) : boolean {

        return this.findPath( source, target ) !== null;

    }

    public static resolve (
        source: ColorSpaceName,
        target: ColorSpaceName
    ) : ConversionHandler {

        ColorSpace.check( source );
        ColorSpace.check( target );

        const path = this.findPath( source, target );

        if ( ! path || path.length < 2 ) {

            throw new PyxeError ( {
                method: 'ConversionGraph',
                msg: `No conversion path from <${source}> to <${target}>`
            } );

        }

        const handler: ConversionHandler[] = [];

        for ( let i = 0; i < path.length - 1; i++ ) {

            const current = path[ i ];
            const next = path[ i + 1 ];

            const cb = conversionGraphRegistry.get( current )[ next ];

            if ( ! cb ) {

                throw new PyxeError ( {
                    method: 'ConversionGraph',
                    msg: `Missing conversion step from <${current}> to <${next}>`
                } );

            }

            handler.push( cb );

        }

        return ( input: any ) => handler.reduce(
            ( acc, cb ) => cb( acc ), input
        );

    }

    public static describePath (
        source: ColorSpaceName,
        target: ColorSpaceName
    ) : string {

        const path = this.findPath( source, target );

        return path ? path.join( ' → ' ) : 'n/a';

    }

    public static tree (
        root: ColorSpaceName,
        maxDepth: number = 9
    ) : string {

        const visited: Set<string> = new Set ();
        const seenNodes: Set<ColorSpaceName> = new Set ();
        const result: string[] = [ root ];

        const _subtree = (
            current: ColorSpaceName,
            depth: number,
            prefix: string = ''
        ) : void => {

            const targets = conversionGraphRegistry.targets( current );

            if ( depth > 0 && targets && targets.length > 0 ) {

                const filtered = targets.filter( t => !seenNodes.has( t ) );

                filtered.forEach( ( target, idx ) => {

                    const pathKey = `${current}::${target}`;
                    const isLast = idx === filtered.length - 1;

                    if ( ! visited.has( pathKey ) ) {

                        seenNodes.add( target );
                        visited.add( pathKey );

                        result.push( `${prefix}${ (
                            isLast ? '└───' : '├───'
                        ) }${target}` );

                        _subtree(
                            target, depth - 1,
                            prefix + ( isLast ? '    ' : '│   ' )
                        );

                    }

                } );

            }

        };

        seenNodes.add( root );

        _subtree( root, maxDepth );

        return result.join( '\n' );

    }

}