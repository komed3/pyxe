'use strict';

import type { ColorSpaceName, ColorObject, ConversionHandler, ConversionPath } from '@pyxe/types';

import { colorSpace } from './colorSpace.js';

import { ErrorHandler } from '@pyxe/utils/lib/errorHandler';

export class ConversionGraph {

    private registry: Map<ColorSpaceName, ConversionPath[]> = new Map ();

    private cache: Map<string, ColorSpaceName[] | null> = new Map ();

    _register (
        source: ColorSpaceName,
        target: ColorSpaceName,
        handler: ConversionHandler
    ) : void {

        if ( ! this.registry.has( source ) ) {

            this.registry.set( source, [] );

        }

        this.registry.get( source )!.push(
            { target, handler }
        );

    }

    _registerMany (
        source: ColorSpaceName,
        paths: ConversionPath[]
    ) : void {

        for ( const { target, handler } of paths ) {

            this._register( source, target, handler );

        }

    }

    _flush () : void {

        this.cache.clear();

    }

    getFrom (
        source: ColorSpaceName
    ) : ConversionPath[] {

        return this.registry.get( source ) || [];

    }

    findPath (
        source: ColorSpaceName,
        target: ColorSpaceName
    ) : ColorSpaceName[] | null {

        if ( source === target ) return [ source ];

        const cacheKey = `${source}::${target}`;

        if ( this.cache.has( cacheKey ) ) {

            return this.cache.get( cacheKey ) as ColorSpaceName[] | null;

        }

        const visited = new Set<ColorSpaceName> ();
        const queue: [ ColorSpaceName, ColorSpaceName[] ][] = [
            [ source, [ source ] ]
        ];

        while ( queue.length > 0 ) {

            const [ current, path ] = queue.shift()!;

            if ( visited.has( current ) ) continue;

            visited.add( current );

            const edges = this.getFrom( current );

            for ( const edge of edges ) {

                if ( edge.target === target ) {

                    const result = [ ...path, edge.target ];

                    this.cache.set( cacheKey, result );

                    return result;

                }

                queue.push( [
                    edge.target,
                    [ ...path, edge.target ]
                ] );

            }

        }

        return null;

    }

    resolve (
        source: ColorSpaceName,
        target: ColorSpaceName
    ) : ConversionHandler {

        colorSpace.check( source );
        colorSpace.check( target );

        const path = this.findPath( source, target );

        if ( ! path || path.length < 2 ) {

            throw new Error ( ErrorHandler.get( {
                method: 'ConversionGraph',
                msg: `No conversion path from <${source}> to <${target}>`
            } ) );

        }

        const handler: ConversionHandler[] = [];

        for ( let i = 0; i < path.length - 1; i++ ) {

            const current = path[ i ];
            const next = path[ i + 1 ];

            const edge = this.getFrom( current ).find(
                ( e ) => e.target === next
            );

            if ( ! edge ) {

                throw new Error( ErrorHandler.get( {
                    method: 'ConversionGraph',
                    msg: `Missing conversion step from <${current}> to <${next}>`
                } ) );

            }

            handler.push( edge.handler );

        }

        return ( input: ColorObject ) => handler.reduce(
            ( acc, cb ) => cb( acc ), input
        );

    }

    describePath (
        source: ColorSpaceName,
        target: ColorSpaceName
    ) : string {

        const path = this.findPath( source, target );

        return path ? path.join( ' → ' ) : 'n/a';

    }

    tree (
        source: ColorSpaceName,
        maxDepth: number = 9
    ) : string {

        let result = [ source ];

        const _subtree = (
            source: ColorSpaceName,
            maxDepth: number,
            prefix: string = ''
        ) : void => {

            const paths = this.registry.get( source );

            if ( paths ) {

                for ( const [ i, path ] of paths.entries() ) {

                    const connector = i === paths.length - 1 ? '└───' : '├───';

                    result.push( `${prefix}${connector}${path.target}` );

                    if ( maxDepth > 0 ) {

                        _subtree(
                            path.target, maxDepth - 1,
                            `${prefix}${ (
                                i === paths.length - 1 ? '    ' : '│   '
                            ) }`
                        );

                    }

                }

            }

        };

        _subtree( source, maxDepth );

        return result.join( '\n' );

    }

}

export const conversionGraph = new ConversionGraph ();