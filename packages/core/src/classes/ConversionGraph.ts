'use strict';

import { ColorSpaceID, ColorObjectFactory, ConversionHandler } from '@pyxe/types';
import { Utils } from '@pyxe/utils';
import { conversionGraphRegistry } from './ConversionGraphRegistry.js';
import { ColorSpace } from './ColorSpace.js';

const cache: Map<string, ColorSpaceID[] | null> = new Map ();

export class ConversionGraph {

    public static flush () : void {

        cache.clear();

    }

    public static findPath (
        source: ColorSpaceID,
        target: ColorSpaceID
    ) : ColorSpaceID[] | null {

        if ( source === target ) return [ source ];

        const cacheKey = `${source}::${target}`;

        if ( cache.has( cacheKey ) ) {

            return cache.get( cacheKey ) as ColorSpaceID[] | null;

        }

        const visited: Set<ColorSpaceID> = new Set ();
        const queue: [ ColorSpaceID, ColorSpaceID[] ][] = [
            [ source, [ source ] ]
        ];

        while ( queue.length > 0 ) {

            const [ current, path ] = queue.shift()!;

            if ( visited.has( current ) ) continue;

            visited.add( current );

            for ( const next of conversionGraphRegistry.getTargets( current ) ) {

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
        source: ColorSpaceID,
        target: ColorSpaceID
    ) : boolean {

        return this.findPath( source, target ) !== null;

    }

    public static resolve (
        source: ColorSpaceID,
        target: ColorSpaceID
    ) : ConversionHandler {

        ColorSpace.check( source );
        ColorSpace.check( target );

        const path = this.findPath( source, target );

        if ( ! path || path.length < 2 ) {

            throw new Utils.Services.error ( {
                method: 'ConversionGraph',
                msg: `No conversion path from <${source}> to <${target}>`
            } );

        }

        const handler: ConversionHandler[] = [];

        for ( let i = 0; i < path.length - 1; i++ ) {

            const current = path[ i ];
            const next = path[ i + 1 ];

            const cb = conversionGraphRegistry.getFrom( current )[ next ];

            if ( ! cb ) {

                throw new Utils.Services.error ( {
                    method: 'ConversionGraph',
                    msg: `Missing conversion step from <${current}> to <${next}>`
                } );

            }

            handler.push( cb );

        }

        return ( input: ColorObjectFactory | undefined ) => handler.reduce(
            ( acc, cb ) => cb( acc ), input
        );

    }

    public static describePath (
        source: ColorSpaceID,
        target: ColorSpaceID
    ) : string {

        const path = this.findPath( source, target );

        return path ? path.join( ' → ' ) : 'n/a';

    }

    public static tree (
        root: ColorSpaceID,
        maxDepth: number = 9
    ) : string {

        const visited: Set<string> = new Set ();
        const seenNodes: Set<ColorSpaceID> = new Set ();
        const result: string[] = [ root ];

        const _subtree = (
            current: ColorSpaceID,
            depth: number,
            prefix: string = ''
        ) : void => {

            const targets = conversionGraphRegistry.getTargets( current );

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