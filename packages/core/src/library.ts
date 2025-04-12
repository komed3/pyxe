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
    NamedColorList,
    NamedColor,
    ColorLibMeta
} from '@pyxe/types';

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
        meta?: ColorLibMeta
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

        for ( const [ libId, lib ] of this.registry[ 'libraries' ].entries() ) {

            for ( const [ key, color ] of Object.entries( lib ) ) {

                if ( color.name?.toLowerCase() === name.toLowerCase() ) {

                    results.push( { lib: libId, key, color } );

                }

            }

        }

        return results;

    }

    /**
     * Searches metadata by tag or partial description.
     * 
     * @param query - Tag or string to search
     * @returns Array of matching color libraries
     */
    searchLibraries (
        query: string
    ) : ColorLibMeta[] {

        return this.registry.list().filter(
            ( meta ) =>
                meta.title?.toLowerCase().includes( query.toLowerCase() ) ||
                meta.description?.toLowerCase().includes( query.toLowerCase() ) ||
                meta.tags?.includes( query.toLowerCase() )
        );

    }

}

/**
 * Singleton instances of the color library and its registry.
 */
export const colorLibRegistry = new ColorLibRegistry ();
export const colorLib = new ColorLib ( colorLibRegistry );