/**
 * Class ConversionGraph
 * src/lib/graph.js
 * 
 * ConversionGraph manages directional color space conversion paths.
 * 
 * It acts as a directed graph structure, where each node represents a color space
 * and each edge represents a direct conversion handler from one space to another.
 * 
 * The graph supports:
 * - Dynamic registration of conversion paths
 * - Path resolution from one space to another, including multi-step conversions
 * - Caching of resolved paths for performance
 * - Tree visualization of conversion routes for debugging or documentation
 * 
 * This is a core component of the pyxe color framework, enabling all dynamic,
 * extensible color transformations across arbitrary color models.
 * 
 * @package @pyxe/core
 * @requires @pyxe/types
 * @requires @pyxe/utils
 * 
 * @author Paul Köhler (komed3)
 * @license MIT
 */

'use strict';

import type {
    ColorSpaceID, ColorObject,
    ConversionHandler, ConversionPath
} from '@pyxe/types';

import { ErrorHandler } from '@pyxe/utils/lib/errorHandler';
import { colorSpace } from './colorSpace.js';

/**
 * Manages conversion paths between registered color spaces as a directed graph.
 */
export class ConversionGraph {

    /**
     * Stores all registered conversion paths.
     * Each source color space ID maps to a list of possible target paths with handlers.
     */
    private registry: Map<ColorSpaceID, ConversionPath[]> = new Map ();

    /**
     * Internal cache to store previously resolved conversion paths
     * for improved performance and reduced traversal.
     */
    private cache: Map<string, ColorSpaceID[] | null> = new Map ();

    /**
     * Registers a direct conversion from a source to a target color space.
     * 
     * @param source - The source color space ID
     * @param target - The target color space ID
     * @param handler - The function that converts between the two spaces
     */
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

    /**
     * Registers multiple conversion paths from a single source space.
     * 
     * @param source - The source color space ID
     * @param paths - A list of target/handler pairs to register
     */
    _registerMany (
        source: ColorSpaceID,
        paths: ConversionPath[]
    ) : void {

        for ( const { target, handler } of paths ) {

            this._register( source, target, handler );

        }

    }

    /**
     * Clears the internal cache of resolved paths.
     * This is useful when the graph has been modified.
     */
    _flush () : void {

        this.cache.clear();

    }

    /**
     * Returns all direct conversion paths from a given source color space.
     * 
     * @param source - The source color space ID
     * @returns A list of all direct conversion targets and handlers
     */
    getFrom (
        source: ColorSpaceID
    ) : ConversionPath[] {

        return this.registry.get( source ) || [];

    }

    /**
     * Resolves the shortest path (if any) from source to target color space.
     * Uses BFS to find the first available route.
     * 
     * @param source - Starting color space ID
     * @param target - Target color space ID
     * @returns An ordered list of color space IDs representing the conversion
     *          route, or null if no path is found
     */
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

    /**
     * Returns a composed conversion handler function for a full path
     * from source to target. The handler applies each step in sequence.
     * 
     * @param source - Starting color space ID
     * @param target - Target color space ID
     * @returns A composed handler function to convert from source to target
     * @throws If no valid path is found or any step is missing
     */
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

        return ( input: ColorObject | undefined ) => handler.reduce(
            ( acc, cb ) => cb( acc ), input
        );

    }

    /**
     * Describes the path from source to target as a readable string,
     * or returns "n/a" if no path is available.
     * 
     * @param source - Starting color space ID
     * @param target - Target color space ID
     * @returns A string such as "rgb → xyz → lab" or "n/a"
     */
    describePath (
        source: ColorSpaceID,
        target: ColorSpaceID
    ) : string {

        const path = this.findPath( source, target );

        return path ? path.join( ' → ' ) : 'n/a';

    }

    /**
     * Returns a tree-style string visualization of all reachable conversions
     * from a given root color space, optionally limited in depth.
     * 
     * @param root - The root color space to start the tree from
     * @param maxDepth - Maximum depth of the tree (default: 99)
     * @returns A multiline string representing the conversion tree
     */
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

/**
 * Singleton instance of the ConversionGraph.
 * Used as the global graph for all conversion path registrations and lookups.
 */
export const conversionGraph = new ConversionGraph ();