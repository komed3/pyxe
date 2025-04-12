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
 * @requires @pyxe/types
 * 
 * @author Paul Köhler (komed3)
 * @license MIT
 */

import type {
    ColorSpaceId,
    ColorObject,
    ConversionCallback,
    ConversionPath
} from '@pyxe/types';

import { registry } from './registry.js';

/**
 * Registry managing all available color space conversions.
 */
export class ConversionGraphRegistry {

    private graph: Map<ColorSpaceId, ConversionPath[]> = new Map ();

    /**
     * Adds a new color space conversion.
     *
     * @param from - Source color space ID
     * @param to - Target color space ID
     * @param callback - Conversion callback from source to target
     */
    add (
        from: ColorSpaceId,
        to: ColorSpaceId,
        callback: ConversionCallback
    ) : void {

        if ( !this.graph.has( from ) ) {

            this.graph.set( from, [] );

        }

        this.graph.get( from )!.push(
            { to, callback }
        );

    }

    /**
     * Register multiple color space conversions at once.
     *
     * @param from - Source color space ID
     * @param conversions - An array of objects containing `to`, and `callback` properties
     */
    addMany (
        from: ColorSpaceId,
        conversions: ConversionPath[]
    ) : void {

        for ( const { to, callback } of conversions ) {

            this.add( from, to, callback );

        }

    }

    /**
     * Get all registered edges for a given color space.
     *
     * @param from - Source color space ID
     * @returns Array of conversion paths
     */
    getConversions (
        from: ColorSpaceId
    ) : ConversionPath[] {

        return this.graph.get( from ) || [];

    }

}

/**
 * A directed graph that stores color space conversions.
 * It allows finding the shortest conversion path and composing transformations.
 */
export class ConversionGraph {

    constructor (
        private registry: ConversionGraphRegistry
    ) {}

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

            const edges = this.registry.getConversions( current );

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

        registry.check( from );
        registry.check( to );

        const path = this.findPath( from, to );

        if ( !path || path.length < 2 ) {

            throw new Error(
                `No conversion path from <${from}> to <${to}>`
            );

        }

        const cbs: ConversionCallback[] = [];

        for ( let i = 0; i < path.length - 1; i++ ) {

            const current = path[ i ];
            const next = path[ i + 1 ];

            const edge = ( this.registry.getConversions( current ) ).find(
                ( e ) => e.to === next
            );

            if ( !edge ) {

                throw new Error(
                    `Missing conversion step from <${current}> to <${next}>`
                );

            }

            cbs.push( edge.callback );

        }

        return ( input: any ) => cbs.reduce(
            ( acc, callback ) => callback( acc ),
            input
        );

    }

    /**
     * Converts a color from one into another color space.
     * 
     * @param input - Color object to convert
     * @param to - Target color space ID
     * @returns Converted color object
     * @throws Throws an error, if the conversion has failed
     */
    convert (
        input: ColorObject,
        to: ColorSpaceId
    ) : ColorObject {

        try {

            const callback = this.resolve( input.space, to );

            return callback( input );

        } catch ( err ) {

            throw new Error (
                `The conversion from color space <${ input.space }> to <${to}> has failed.`
            );

        }

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
     * Visualize all color space conversions from a given one to all other spaces
     * using a simple ASCII tree structure. Hides edges pointing back.
     *
     * @param from - Source color space ID
     * @param maxDepth - Maximal tree depth (default is 99)
     * @returns A string representing the tree structure
     */
    tree (
        from: ColorSpaceId,
        maxDepth: number = 99
    ) : string {

        const visited = new Set<ColorSpaceId> ();
        const result : string[] = [];

        const _subtree = (
            current: ColorSpaceId,
            depth: number
        ) : void => {

            if (
                !visited.has( current ) &&
                depth < maxDepth
            ) {

                visited.add( current );

                const edges = this.registry.getConversions( current );

                for ( const edge of edges ) {

                    if ( edge.to !== from ) {

                        result.push( `${ '  '.repeat( depth ) }├─ ${edge.to}` );

                        _subtree( edge.to, depth + 1 );

                    }

                }

            }

        };

        result.push( `─ ${from}` );

        _subtree( from, 1 );

        return result.join( '\n' );

    }

}

/**
 * Singleton instances of the global conversion graph and its registy.
 */
export const conversionGraphRegistry = new ConversionGraphRegistry ();
export const conversionGraph = new ConversionGraph ( conversionGraphRegistry );