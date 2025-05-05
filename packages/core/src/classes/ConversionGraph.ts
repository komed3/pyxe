'use strict';

import type { ColorSpaceName, ConversionHandler } from '@pyxe/types';
import { ChannelHelper } from '@pyxe/utils';
import { ColorSpace } from './ColorSpace.js';
import { conversionGraphRegistry } from '../registries/ConversionGraphRegistry.js';
import { handleError } from '../services/ErrorUtils.js';
import { hook } from '../services/Hook.js';

export class ConversionGraph {

    private pathCache: Map<string, ColorSpaceName[] | null> = new Map ();
    private cbCache: Map<string, ConversionHandler | null> = new Map ();

    constructor (
        private safe: boolean = true
    ) {}

    private _cacheKey (
        source: ColorSpaceName,
        target: ColorSpaceName
    ) : string {

        return hook.filter( 'ConversionGraph::cacheKey', `${source}::${target}`, source, target, this );

    }

    public flush () : void {

        this.pathCache.clear();
        this.cbCache.clear();

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

        const cacheKey = this._cacheKey( source, target );

        if ( this.pathCache.has( cacheKey ) ) {

            return this.pathCache.get( cacheKey )!;

        }

        const visited: Set<ColorSpaceName> = new Set ();
        const queue: [ ColorSpaceName, ColorSpaceName[] ][] = [
            [ source, [ source ] ]
        ];

        while ( queue.length > 0 ) {

            const [ curr, path ] = queue.shift()!;

            if ( visited.has( curr ) ) continue;

            visited.add( curr );

            for ( const next of conversionGraphRegistry.targets( curr ) ) {

                if ( visited.has( next ) ) continue;

                const newPath = [ ...path, next ];

                if ( next === target ) {

                    this.pathCache.set( cacheKey, newPath );

                    return newPath;

                }

                queue.push( [ next, newPath ] );

            }

        }

        this.pathCache.set( cacheKey, null );

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

        source = path[ 0 ];
        target = path[ path.length - 1 ];

        const cacheKey = this._cacheKey( source, target );

        if ( this.cbCache.has( cacheKey ) ) {

            return this.cbCache.get( cacheKey )!;

        }

        const handler: ConversionHandler[] = [];

        for ( let i = 0; i < path.length - 1; i++ ) {

            const curr = path[ i ];
            const next = path[ i + 1 ];

            const currSpace = ColorSpace.getInstance( curr ) as ColorSpace;
            const nextSpace = ColorSpace.getInstance( next ) as ColorSpace;

            const cb = conversionGraphRegistry.get( curr )[ next ];

            if ( ! cb ) {

                this.cbCache.set( cacheKey, null );

                return handleError( {
                    method: 'ConversionGraph',
                    msg: `Missing conversion step from <${curr}> to <${next}>`
                }, this.safe );

            }

            handler.push( ( input: any ) => {

                if ( ! currSpace.linear() && nextSpace.linear() ) {

                    ChannelHelper.gamma( input, nextSpace.gamma( 'decode' ) );

                }

                const result = cb( input );

                if ( currSpace.linear() && ! nextSpace.linear() ) {

                    ChannelHelper.gamma( result!, currSpace.gamma( 'encode' ) );

                }

                return result;

            } );

        }

        const callback = ( input: any ) => handler.reduce(
            ( acc, cb ) => cb( acc ), input
        );

        this.cbCache.set( cacheKey, callback );

        return callback;

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
        curr: ColorSpaceName,
        depth: number,
        prefix: string = ''
    ) : void => {

        const targets = conversionGraphRegistry.targets( curr );

        if ( depth > 0 && targets && targets.length > 0 ) {

            const filtered = targets.filter( t => !seenNodes.has( t ) );

            filtered.forEach( ( target, idx ) => {

                const pathKey = `${curr}::${target}`;
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