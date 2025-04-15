/**
 * Class ColorSpace
 * src/lib/colorSpace.ts
 * 
 * The `ColorSpace` class provides centralized registration and lookup functionality
 * for all supported color spaces in the pyxe framework. It acts as an internal service
 * used by higher-level components (e.g., parsers, converters, validators) to manage
 * available color spaces and their associated conversion definitions.
 * 
 * Color space modules register themselves dynamically at runtime by calling `_register()`,
 * which will also update the internal conversion graph if relevant transformation rules
 * are provided.
 * 
 * This class is *not* typically used directly by consumers of the library. Instead,
 * it powers core logic such as parsing, transformation, and introspection.
 * 
 * @package @pyxe/core
 * @requires @pyxe/types
 * @requires @pyxe/utils
 * 
 * @author Paul Köhler (komed3)
 * @license MIT
 */

'use strict';

import type { ColorSpaceID, ColorSpaceFactory } from '@pyxe/types';
import { Utils } from '@pyxe/utils';
import { conversionGraph } from './graph.js';

/**
 * The actual main registration class for color spaces.
 */
export class ColorSpace {

    /**
     * Internal registry for all declared color spaces.
     * Each entry is a color space ID mapped to its corresponding factory.
     */
    private registry: Map<ColorSpaceID, ColorSpaceFactory> = new Map ();

    /**
     * Registers a new color space and optionally its conversions.
     * If the color space has already been registered, an error is thrown.
     * 
     * This method is intended to be called by color spaces during setup.
     * 
     * @param id - Unique identifier of the color space
     * @param factory - Factory object implementing the color space definition
     * @throws Error if the color space ID has already been registered
     */
    _register (
        id: ColorSpaceID,
        factory: ColorSpaceFactory
    ) : void {

        if ( ! this.has( id ) ) {

            this.registry.set( id, factory );

            if ( factory.conversions ) {

                conversionGraph._registerMany( id, factory.conversions );

            }

        } else {

            throw new Utils.error( {
                method: 'ColorSpace',
                msg: `Color space named <${id}> is already declared`
            } );

        }

    }

    /**
     * Unregisters a color space and removes all of its conversions from the graph.
     * If the color space is not registered, an error is thrown.
     * 
     * This method is intended for internal use, e.g., in testing or plugin unloading.
     * 
     * @param id - Color space ID to remove
     * @throws Error if the color space does not exist
     */
    _unregister (
        id: ColorSpaceID
    ) : void {

        if ( this.check( id ) ) {

            this.registry.delete( id );

            conversionGraph._unregisterAll( id );

        }

    }

    /**
     * Checks if a color space with the given ID is registered.
     * 
     * @param id - The color space ID to look up
     * @returns `true` if the color space is registered, `false` otherwise
     */
    has (
        id: ColorSpaceID
    ) : boolean {

        return this.registry.has( id );

    }

    /**
     * Verifies that a color space is registered and throws an error if not.
     * 
     * @param id - Color space ID to check
     * @returns `true` if the color space exists
     * @throws Error if the color space is not registered
     */
    check (
        id: ColorSpaceID
    ) : boolean {

        if ( ! this.has( id ) ) {

            throw new Utils.error( {
                method: 'ColorSpace',
                msg: `The color space <${id}> is not registered`
            } );

        }

        return true;

    }

    /**
     * Retrieves a color space factory by its ID.
     * 
     * @param id - Color space ID to retrieve
     * @param safe - Whether to throw an error if the space does not exist (default: `true`)
     * @returns The factory if found, or `undefined` if `safe` is `false` and not found
     * @throws Error if `safe` is `true` and the color space is not registered
     */
    get (
        id: ColorSpaceID,
        safe = true
    ) : ColorSpaceFactory | undefined {

        if ( ! safe || this.check( id ) ) {

            return this.registry.get( id );

        }

    }

    /**
     * Returns a list of all registered color space IDs.
     * 
     * @returns An array of registered color space identifiers
     */
    getSpaces () : ColorSpaceID[] {

        return Array.from(
            this.registry.keys()
        );

    }

    /**
     * Retrieves optional meta-information associated with a color space.
     * Returns `undefined` if no metadata is defined.
     * 
     * @param id - Color space ID
     * @returns The `meta` field from the color space factory, if defined
     * @throws Error if the color space is not registered
     */
    getMeta (
        id: ColorSpaceID
    ) : any {

        return this.get( id )?.meta;

    }

}

/**
 * Singleton instance of the ColorSpace registry.
 * This is the globally shared entry point for managing all color space registrations.
 */
export const colorSpace = new ColorSpace ();