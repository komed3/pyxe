/**
 * Color Space Conversion Graph
 * src/graph.ts
 * 
 * The ConversionGraph class allows registering and resolving paths to transform a source
 * color space into a target color space. As not every color space is transformed directly
 * into another, the conversion takes place stepwise, e.g. "rgb → xyz → lab".
 * 
 * Each color space dynamically registers existing transformation callbacks. As soon as
 * this has been done, the graph can be accessed via pyxe's central API and one color
 * space can be converted into another. If there is no path between two color spaces,
 * the method throws an error.
 * 
 * @package @pyxe/core
 * @author Paul Köhler (komed3)
 * @license MIT
 */

import type { ColorSpaceId } from '@pyxe/types';

/**
 * Type of a callable function to transform one color space into another.
 */
export type ConversionCallback = ( input: any ) => any;

interface ConversionPath {
    to: ColorSpaceId;
    cb: ConversionCallback;
}

/**
 * A directed graph that stores color space conversions.
 * It allows finding the shortest conversion path and composing transformations.
 */
export class ConversionGraph {

    private graph = new Map<ColorSpaceId, ConversionPath[]> ();

    /**
     * Register a new color space conversion.
     *
     * @param from - Source color space ID
     * @param to - Target color space ID
     * @param cb - Conversion callback from source to target
     */
    register (
        from: ColorSpaceId,
        to: ColorSpaceId,
        cb: ConversionCallback
    ) : void {

        if ( !this.graph.has( from ) ) {

            this.graph.set( from, [] );

        }

        this.graph.get( from )!.push( { to, cb } );

    }

    /**
     * Find the shortest path from one color space to another.
     *
     * @param from - Source color space ID
     * @param to - Target color space ID
     * @returns Array of color space IDs representing the path, or null if no path exists
     */
    findPath (
        from: ColorSpaceId,
        to: ColorSpaceId
    ) : ColorSpaceId[] | null {

        if ( from === to ) return [ from ];

        const visited = new Set<ColorSpaceId> ();
        const queue: [ ColorSpaceId, ColorSpaceId[] ][] = [ [ from, [ from ] ] ];

        while ( queue.length > 0 ) {

            const [ current, path ] = queue.shift()!;

            if ( visited.has( current ) ) continue;

            visited.add( current );

            const edges = this.graph.get( current ) || [];

            for ( const edge of edges ) {

                if ( edge.to === to ) {

                    return [ ...path, edge.to ];
                }

                queue.push( [
                    edge.to,
                    [ ...path, edge.to ]
                ] );

            }

        }

        return null;

    }

    /**
     * Get a composed conversion callback from one color space to another.
     *
     * @param from - Source color space ID
     * @param to - Target color space ID
     * @returns Conversion callback composed from registered edges
     * @throws Throws an error if no path exists
     */
    resolve (
        from: ColorSpaceId,
        to: ColorSpaceId
    ) : ConversionCallback {

        const path = this.findPath( from, to );

        if ( !path || path.length < 2 ) {

            throw new Error(
                `No conversion path from <${from}> to <${to}>`
            );

        }

        const fns: ConversionCallback[] = [];

        for ( let i = 0; i < path.length - 1; i++ ) {

            const current = path[ i ];
            const next = path[ i + 1 ];

            const edge = ( this.graph.get( current ) || [] ).find(
                ( e ) => e.to === next
            );

            if ( !edge ) {

                throw new Error(
                    `Missing conversion step from <${current}> to <${next}>`
                );

            }

            fns.push( edge.cb );

        }

        return ( input: any ) => fns.reduce(
            ( acc, cb ) => cb( acc ),
            input
        );

    }

    /**
     * Describe the conversion path from one color space to another as a string.
     *
     * @param from - Source color space ID
     * @param to - Target color space ID
     * @returns A string like "rgb → xyz → lab", or "n/a" if no path exists
     */
    describePath (
        from: ColorSpaceId,
        to: ColorSpaceId
    ) : string {

        const path = this.findPath( from, to );

        return path ? path.join( ' → ' ) : 'n/a';

    }

    /**
     * List all directly reachable color spaces from a given source.
     *
     * @param from - Source color space ID
     * @returns Array of target color space IDs
     */
    getTargets (
        from: ColorSpaceId
    ) : ColorSpaceId[] {

        return ( this.graph.get( from ) || [] ).map(
            ( edge ) => edge.to
        );

    }

}

/**
 * Singleton instance of the global conversion graph
 */
export const conversionGraph = new ConversionGraph ();