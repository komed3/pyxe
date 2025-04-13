/**
 * Color Library System
 * src/library.ts
 * 
 * This module provides functionality to manage named color libraries such as RAL, HTML
 * color names, or other standardized/named color sets. It offers two main classes:
 * 
 *   - `ColorLibRegistry`: Handles the internal registration and indexing of all color libraries.
 *   - `ColorLib`: Public API for users to access, search, and retrieve colors.
 * 
 * The registry only stores metadata and references, ensuring minimal memory usage.
 * 
 * @package @pyxe/core
 * @requires @pyxe/types
 * 
 * @author Paul Köhler (komed3)
 * @license MIT
 */

import type {
    ColorObject,
    NamedColorList,
    NamedColor,
    ColorLibMeta,
    ColorSpaceId
} from '@pyxe/types';

import { registry } from './registry.js';

/**
 * Internal registry for all named color libraries.
 */
export class ColorLibRegistry {

    private libraries = new Map<string, NamedColorList> ();

    private metadata = new Map<string, ColorLibMeta> ();

    /**
     * Adds a new named color library.
     * 
     * @param id - Unique ID for the library (e.g., 'RAL')
     * @param colors - Object containing all named colors
     * @param meta - Optional metadata for the library
     */
    add (
        id: string,
        colors: NamedColorList,
        meta?: Partial<ColorLibMeta>
    ) : void {

        this.libraries.set( id, colors );

        this.metadata.set( id, {
            id, count: Object.keys( colors ).length,
            ...meta
        } );

    }

    /**
     * Returns metadata for all registered libraries.
     * 
     * @returns Array of color library meta
     */
    list () : ColorLibMeta[] {

        return Array.from( this.metadata.values() );

    }

    /**
     * Searches metadata by tag or partial description.
     * 
     * @param query - Tag or string to search
     * @returns Array of matching color libraries
     */
    search (
        query: string
    ) : ColorLibMeta[] {

        return this.list().filter(
            ( meta ) =>
                meta.title?.toLowerCase().includes( query.toLowerCase() ) ||
                meta.description?.toLowerCase().includes( query.toLowerCase() ) ||
                meta.tags?.includes( query.toLowerCase() )
        );

    }

    /**
     * Returns metadata for a specific library.
     * 
     * @param id - Library ID
     * @returns Color library meta or undefined
     */
    getMeta (
        id: string
    ) : ColorLibMeta | undefined {

        return this.metadata.get(id);

    }

    /**
     * Checks whether a library is registered or not.
     * 
     * @param id - Library ID
     * @returns True if registered, false otherwise
     */
    has (
        id: string
    ) : boolean {

        return this.libraries.has( id );

    }

    /**
     * Returns a full color library object.
     * 
     * @param id - Library ID
     * @returns A named color list or undefined
     */
    get (
        id: string
    ) : NamedColorList | undefined {

        return this.libraries.get( id );

    }

    /**
     * Returns an iterable of library ID, color list pairs.
     * 
     * @returns Iterable with library IDs and color lists
     */
    getAll () : MapIterator<[string, NamedColorList]> {

        return this.libraries.entries();

    }

}

/**
 * Public API class for accessing and searching color libraries.
 */
export class ColorLib {

    constructor (
        private registry: ColorLibRegistry
    ) {}

    /**
     * Returns a named color from a specific library.
     * 
     * @param libId - Library ID
     * @param colorId - Color key (e.g., 'RAL 1000')
     * @returns Color library entry or undefined
     */
    get (
        libId: string,
        colorId: string
    ) : NamedColor | undefined {

        return this.registry.get( libId )?.[ colorId ];

    }

    /**
     * Convert a given color key from a library to a color object.
     *
     * @param libId - Library ID
     * @param colorId - Color key (e.g., 'RAL 1000')
     * @param preferredSpaces - Preferred color spaces
     * @param options - Additional options, e.g. strict mode
     * @returns Color object or undefined
     * @throws Throws an error, if the color does not exist or no compatible color space was found
     */
    from (
        libId: string,
        colorId: string,
        preferredSpaces?: ColorSpaceId[] | ColorSpaceId,
        options?: {
            strict?: boolean
        }
    ) : ColorObject {

        const entry = this.get( libId, colorId );

        if ( ! entry ) {

            throw new Error(
                `Requested color <${colorId}> does not appear in the <${libId}> library`
            );

        }

        const candidates = [ ...new Set ( [
            ...( Array.isArray( preferredSpaces ) ? preferredSpaces : [ preferredSpaces ] ),
            ...( options?.strict ? [] : registry.getSpaces() )
        ].filter( Boolean ) ) ];

        for ( const space of candidates ) {

            if ( space && entry[ space ] ) {

                return {
                    space, value: entry[ space ],
                    meta: { source: entry }
                };

            }

        }

        throw new Error ( options?.strict
            ? `None of the preferred color spaces are available for <${colorId}> in <${libId}>`
            : `No compatible color space value found for <${colorId}> in <${libId}>`
        );

    }

    /**
     * Lists all color keys in a given library.
     * 
     * @param libId - Library ID
     * @returns Array of color library keys
     */
    listColors (
        libId: string
    ) : string[] {

        return Object.keys( this.registry.get( libId ) || {} );

    }

    /**
     * Finds colors by exact name match across all libraries.
     * @param name - Name to search for
     */
    findByName (
        name: string
    ) : {
        lib: string;
        key: string;
        color: NamedColor
    }[] {

        const results: {
            lib: string;
            key: string;
            color: NamedColor
        }[] = [];

        for ( const [ libId, lib ] of this.registry.getAll() ) {

            for ( const [ key, color ] of Object.entries( lib ) ) {

                if ( color.name?.toLowerCase() === name.toLowerCase() ) {

                    results.push( { lib: libId, key, color } );

                }

            }

        }

        return results;

    }

}

/**
 * Singleton instances of the color library and its registry.
 */
export const colorLibRegistry = new ColorLibRegistry ();
export const colorLib = new ColorLib ( colorLibRegistry );