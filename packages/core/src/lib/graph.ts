'use strict';

import type { ColorSpaceID, ColorObject, ConversionHandler, ConversionPath } from '@pyxe/types';

import { colorSpace } from './colorSpace.js';

import { ErrorHandler } from '@pyxe/utils/lib/errorHandler';

export class ConversionGraph {

    private registry: Map<ColorSpaceID, ConversionPath[]> = new Map ();

    private cache: Map<string, ColorSpaceID[] | null> = new Map ();

    _register (
        source: ColorSpaceID,
        target: ColorSpaceID,
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
        source: ColorSpaceID,
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
        source: ColorSpaceID
    ) : ConversionPath[] {

        return this.registry.get( source ) || [];

    }

    findPath (
        source: ColorSpaceID,
        target: ColorSpaceID
    ) : ColorSpaceID[] | null {

        if ( source === target ) return [ source ];

        const cacheKey = `${source}::${target}`;

        if ( this.cache.has( cacheKey ) ) {

            return this.cache.get( cacheKey ) as ColorSpaceID[] | null;

        }

        const visited: Set<ColorSpaceID> = new Set ();
        const queue: [ ColorSpaceID, ColorSpaceID[] ][] = [
            [ source, [ source ] ]
        ];

        while ( queue.length > 0 ) {

            const [ current, path ] = queue.shift()!;

            if ( visited.has( current ) ) continue;

            visited.add( current );

            for ( const { target: next } of this.getFrom( current ) ) {

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

    resolve (
        source: ColorSpaceID,
        target: ColorSpaceID
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
        source: ColorSpaceID,
        target: ColorSpaceID
    ) : string {

        const path = this.findPath( source, target );

        return path ? path.join( ' → ' ) : 'n/a';

    }

    tree (
        root: ColorSpaceID,
        maxDepth: number = 99
    ) : string {

        const visited: Set<string> = new Set ();
        const seenNodes: Set<ColorSpaceID> = new Set ();
        const result: string[] = [ root ];

        const _subtree = (
            current: ColorSpaceID,
            depth: number,
            prefix: string = ''
        ) : void => {

            const paths = this.registry.get( current );

            if ( depth > 0 && paths && paths.length > 0 ) {

                const filtered = paths.filter( p => !seenNodes.has( p.target ) );

                filtered.forEach( ( path, idx ) => {

                    const pathKey = `${current}::${path.target}`;
                    const isLast = idx === filtered.length - 1;

                    if ( ! visited.has( pathKey ) ) {

                        seenNodes.add( path.target );
                        visited.add( pathKey );

                        result.push( `${prefix}${ (
                            isLast ? '└───' : '├───'
                        ) }${path.target}` );

                        _subtree(
                            path.target, depth - 1,
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

export const conversionGraph = new ConversionGraph ();