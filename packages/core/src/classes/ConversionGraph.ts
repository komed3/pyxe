'use strict';

import type { ColorSpaceName, ConversionHandler } from '@pyxe/types';
import { ColorSpace } from './ColorSpace.js';
import { conversionGraphRegistry } from '../registries/ConversionGraphRegistry.js';
import { handleError } from '../services/ErrorUtils.js';

export class ConversionGraph {

    private cache: Map<string, ColorSpaceName[] | null> = new Map ();

    constructor (
        private safe: boolean = true
    ) {}

    public flush () : void {

        this.cache.clear();

    }

    public targets (
        source: ColorSpaceName
    ) : ColorSpaceName[] {

        return conversionGraphRegistry.targets( ColorSpace.resolve( source ) );

    }

    public findPath (
        source: ColorSpaceName,
        target: ColorSpaceName
    ) : ColorSpaceName[] | null {

        source = ColorSpace.resolve( source );
        target = ColorSpace.resolve( target );

        if ( source === target ) return [ source ];

        const cacheKey = `${source}::${target}`;

        if ( this.cache.has( cacheKey ) ) {

            return this.cache.get( cacheKey )!;

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

                    this.cache.set( cacheKey, newPath );

                    return newPath;

                }

                queue.push( [ next, newPath ] );

            }

        }

        this.cache.set( cacheKey, null );

        return null;

    }

    public hasPath (
        source: ColorSpaceName,
        target: ColorSpaceName
    ) : boolean {

        return this.findPath( source, target ) !== null;

    }

    public resolve (
        source: ColorSpaceName,
        target: ColorSpaceName
    ) : ConversionHandler | false {

        const path = this.findPath( source, target );

        if ( ! path || path.length < 2 ) {

            return handleError( {
                method: 'ConversionGraph',
                msg: `No conversion path from <${source}> to <${target}>`
            }, this.safe );

        }

        const handler: ConversionHandler[] = [];

        for ( let i = 0; i < path.length - 1; i++ ) {

            const current = path[ i ];
            const next = path[ i + 1 ];

            const cb = conversionGraphRegistry.get( current )[ next ];

            if ( ! cb ) {

                return handleError( {
                    method: 'ConversionGraph',
                    msg: `Missing conversion step from <${current}> to <${next}>`
                }, this.safe );

            }

            handler.push( cb );

        }

        return ( input: any ) => handler.reduce(
            ( acc, cb ) => cb( acc ), input
        );

    }

    public describePath (
        source: ColorSpaceName,
        target: ColorSpaceName
    ) : string {

        const path = this.findPath( source, target );

        return path ? path.join( ' → ' ) : 'n/a';

    }

}

export const conversionGraph = new ConversionGraph ();

export const tree = (
    root: ColorSpaceName,
    maxDepth: number = 9
) : string => {

    root = ColorSpace.resolve( root );

    const visited: Set<string> = new Set ();
    const seenNodes: Set<ColorSpaceName> = new Set ();
    const result: string[] = [ root.toUpperCase() ];

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
                    ) }${ target.toUpperCase() }` );

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

};