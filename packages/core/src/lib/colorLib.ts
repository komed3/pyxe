/**
 * Class ColorLib
 * src/lib/colorLib.ts
 * 
 * The `ColorLib` module provides a dynamic interface for accessing and managing
 * named color libraries such as RAL, HTML, or Pantone. Libraries can be registered
 * via `ColorLibRegistry` and are loaded lazily through factory functions,
 * allowing efficient memory usage and modular loading behavior.
 * 
 * Each color library may consist of multiple sources (e.g., separate modules for
 * classic or special editions), which are loaded on-demand. The `ColorLib` class
 * supports listing, matching, filtering, and retrieving color entries, including
 * optional conversion between color spaces using the `pyxe` conversion engine.
 * 
 * Key features are:
 * - Lazy loading of named color data
 * - Singleton management for library instances
 * - Flexible querying (by ID, name match, or tag/category)
 * - Support for preferred color spaces and fallback conversion
 * - Central registry for metadata and factory control
 * 
 * @package @pyxe/core
 * @requires @pyxe/types
 * @requires @pyxe/utils
 * 
 * @author Paul Köhler (komed3)
 * @license MIT
 */

'use strict';

import {
    ColorSpaceID, ColorInstance, ColorObject, ColorLibFactory,
    ColorLibLoader, ColorLibList, ColorLibEntry
} from '@pyxe/types';

import { Utils } from '@pyxe/utils';
import { convert } from './convert.js';

/**
 * Global singleton map to ensure that each color library is instantiated only once.
 * Used within the `Color` class when calling `Color.fromLib()`.
 */
const ColorLibInstances: Map<string, ColorLib> = new Map ();

/**
 * Class representing a single color library (e.g., RAL, HTML Colors).
 * Supports lazy loading, color lookup, filtering, and optional color
 * space conversion.
 */
export class ColorLib {

    /** The identifier of the color library (e.g. `RAL`) */
    readonly id: string;

    /** The central factory for describing a color library */
    private factory: ColorLibFactory;

    /** Saves loaded resources of a color library */
    private loaded: Set<string> = new Set ();

    /** A list of all loaded entries of a color library */
    private entries: ColorLibList = [];

    /**
     * Creates a new ColorLib instance and optionally preloads given sources.
     * Prefer `ColorLib.getInstance()` for singleton-safe access.
     *
     * @param id - Library identifier
     * @param sources - Optional list of sources to preload
     */
    constructor (
        id: string,
        sources?: string[]
    ) {

        const factory = colorLibRegisty.get( id ) as ColorLibFactory;

        this.id = id;
        this.factory = factory;

        if ( sources ) {

            this._ensureLoaded( sources );

        }

    }

    /**
     * Returns a singleton instance for the given color library.
     * If it doesn't exist yet, it will be created.
     *
     * @param id - Library identifier
     * @param sources - Optional sources to preload
     * @returns Singleton ColorLib instance
     */
    static getInstance (
        id: string,
        sources?: string[]
    ) : ColorLib {

        if ( ! ColorLibInstances.has( id ) ) {

            ColorLibInstances.set(
                id, new ColorLib( id, sources )
            );

        }

        return ColorLibInstances.get( id )!;

    }

    /**
     * Destroys the singleton instance for a given library (if present).
     *
     * @param id - Library identifier
     */
    static destroyInstance (
        id: string
    ) : void {

        ColorLibInstances.delete( id );

    }

    /**
     * Loads and caches a specific source if it hasn't been loaded yet.
     *
     * @param source - The source key defined in the factory
     * @throws If the source cannot be resolved
     */
    private async _loadSource (
        source: string
    ) : Promise<void> {

        if ( ! this.hasSource( source, true ) ) {

            try {

                const entries = await (
                    this.factory.sources[ source ] as ColorLibLoader
                )();

                this.entries.push( ...entries );
                this.loaded.add( source );

            } catch ( err ) {

                throw new Utils.error( {
                    err, method: 'ColorLib',
                    msg: `Source <${source}> not found in library <${this.id}>`
                } );

            }

        }

    }

    /**
     * Ensures that all specified or available sources are loaded.
     *
     * @param sources - Optional list of sources to load
     */
    private async _ensureLoaded (
        sources?: string[]
    ) : Promise<void> {

        for ( const source of ( sources ?? this.getSources() ) ) {

            await this._loadSource( source );

        }

    }

    /**
     * Retrieves a color entry by its ID.
     *
     * @param colorID - The unique color identifier (e.g., "RAL 3020")
     * @param sources - Optional sources to search in
     * @returns Matching color entry or undefined
     */
    private async _getColor (
        colorID: string,
        sources?: string[]
    ) : Promise<ColorLibEntry | undefined> {

        await this._ensureLoaded( sources );

        return this.entries.find(
            ( e ) => e.id === colorID
        );

    }

    /**
     * Lists all available color entries in the library.
     *
     * @param sources - Optional sources to restrict the list to
     * @returns Array of all color entries
     */
    async list (
        sources?: string[]
    ) : Promise<ColorLibList> {

        await this._ensureLoaded( sources );

        return this.entries;

    }

    /**
     * Performs a fuzzy name match within all entries.
     *
     * @param query - Case-insensitive substring to match in color name(s)
     * @param sources - Optional sources to search in
     * @returns Matching color entries
     */
    async match (
        query: string,
        sources?: string[]
    ) : Promise<ColorLibList> {

        await this._ensureLoaded( sources );

        return this.entries.filter(
            ( e ) => JSON.stringify( e.name ).match(
                new RegExp( query, 'i' )
            )
        );

    }

    /**
     * Filters entries by tag/category label (e.g., "pastel", "metallic").
     *
     * @param tag - Tag label to match
     * @param sources - Optional sources to search in
     * @returns Matching color entries
     */
    async filter (
        tag: string,
        sources?: string[]
    ) : Promise<ColorLibList> {

        await this._ensureLoaded( sources );

        return this.entries.filter(
            ( e ) => e.meta?.tags?.includes( tag )
        );

    }

    /**
     * Retrieves the raw metadata entry for a specific color.
     *
     * @param colorID - ID of the color
     * @param sources - Optional sources to search in
     * @returns The color entry, if found
     */
    async getColorEntry (
        colorID: string,
        sources?: string[]
    ) : Promise<ColorLibEntry | undefined> {

        const entry = await this._getColor( colorID, sources );

        return entry;

    }

    /**
     * Retrieves a color object (including space and value) for a given ID,
     * optionally converting to a preferred color space if necessary.
     *
     * @param colorID - ID of the color to retrieve
     * @param preferredSpaces - Priority list of acceptable color spaces
     * @param options - Configuration object
     *   - `sources`: restrict search to specific sources
     *   - `strict`: only use explicitly defined color spaces
     *   - `tryConvert`: allow automatic conversion via internal graph
     * @returns A color object or undefined if not found
     */
    async getColor (
        colorID: string,
        preferredSpaces?: ColorSpaceID[],
        options: {
            sources?: string[];
            strict?: boolean;
            tryConvert?: boolean;
        } = {}
    ) : Promise<ColorObject | undefined> {

        try {

            const { sources, strict = false, tryConvert = false } = options;

            const entry = await this._getColor( colorID, sources );

            if ( entry ) {

                for ( const space of [ ...new Set ( [
                    ...preferredSpaces ?? [],
                    ...strict ? [] : Object.keys( entry.spaces ) as ColorSpaceID[]
                ].filter( Boolean ) ) ] ) {

                    if ( space in entry.spaces ) {

                        let color: ColorObject = {
                            space, value: entry.spaces[ space ] as ColorInstance,
                            meta: { source: entry }
                        };

                        if (
                            preferredSpaces &&
                            ! preferredSpaces.includes( space ) &&
                            tryConvert
                        ) {

                            color = convert.tryConvert(
                                color, preferredSpaces
                            ) as ColorObject;

                        }

                        return color;

                    }

                }

            }

        } catch {}

        return undefined;

    }

    /**
     * Returns a list of all available source keys for this library.
     *
     * @returns Array of source names
     */
    getSources () : string[] {

        return Object.keys(
            this.factory.sources
        );

    }

    /**
     * Checks whether a specific source exists in the factory and/or
     * has been loaded.
     *
     * @param source - Source name to check
     * @param loaded - If `true`, only checks if it has already been loaded
     * @returns Boolean status
     */
    hasSource (
        source: string,
        loaded: boolean = false
    ) : boolean {

        return loaded
            ? this.loaded.has( source )
            : source in this.factory.sources;

    }

}

/**
 * Registry for managing all available color libraries.
 * Responsible for registering and retrieving `ColorLibFactory` definitions.
 */
export class ColorLibRegisty {

    /** The internal registry of all installed color libraries */
    private registry: Map<string, ColorLibFactory> = new Map ();

    /**
     * Registers a new color library factory under a given ID.
     *
     * @param id - Unique identifier for the library
     * @param factory - Factory function providing source definitions
     * @throws If the ID is already registered
     */
    _register (
        id: string,
        factory: ColorLibFactory
    ) : void {

        if ( ! this.has( id ) ) {

            this.registry.set( id, factory );

        } else {

            throw new Utils.error( {
                method: 'ColorLib',
                msg: `Color library named <${id}> already registered`
            } );

        }

    }

    /**
     * Unregisters a color library.
     *
     * @param id - Library identifier
     */
    _unregister (
        id: string
    ) : void {

        if ( this.check( id ) ) {

            this.registry.delete( id );

        }

    }

    /**
     * Checks whether a library is registered.
     *
     * @param id - Library identifier
     * @returns `true` if registered, `false` otherwise
     */
    has (
        id: string
    ) : boolean {

        return this.registry.has( id );

    }

    /**
     * Verifies that a library is registered and throws an error if not.
     *
     * @param id - Library identifier
     * @returns `true` if registered
     * @throws If the ID is not registered
     */
    check (
        id: string
    ) : boolean {

        if ( ! this.has( id ) ) {

            throw new Utils.error( {
                method: 'ColorLib',
                msg: `The color library <${id}> is not registered`
            } );

        }

        return true;

    }

    /**
     * Retrieves the factory for a registered library.
     *
     * @param id - Library identifier
     * @param safe - If `true` (default), will throw on unknown ID
     * @returns The factory function, or undefined if not found
     */
    get (
        id: string,
        safe: boolean = true
    ) : ColorLibFactory | undefined {

        if ( ! safe || this.check( id ) ) {

            return this.registry.get( id );

        }

    }

    /**
     * Lists all registered library identifiers.
     *
     * @returns Array of IDs
     */
    getLibraries () : string[] {

        return Array.from(
            this.registry?.keys() ?? []
        );

    }

    /**
     * Retrieves metadata associated with a registered library.
     *
     * @param id - Library identifier
     * @returns Arbitrary metadata object (if available)
     */
    getMeta (
        id: string
    ) : any {

        return this.get( id )?.meta;

    }

}

/**
 * Singleton instance of the color library registy.
 * This is used internally by `ColorLib` to resolve library factories.
 */
export const colorLibRegisty = new ColorLibRegisty ();