/**
 * Color Output System
 * src/output.ts
 * 
 * This module handles output formatting (e.g. string, JSON) for validated color objects.
 * Each color space can register its own output methods. If no method is found, a fallback
 * is used or an error is thrown.
 * 
 * @package @pyxe/core
 * @requires @pyxe/types
 * 
 * @author Paul Köhler
 * @license MIT
 */

import type { ColorSpaceId, ColorObject, OutputMethods } from '@pyxe/types';

/**
 * Internal registry for output methods.
 */
export class OutputRegistry {

    private registry: Map<ColorSpaceId, OutputMethods> = new Map ();

    /**
     * Register output methods for a specific color space.
     * 
     * @param id - Color space ID
     * @param methods - Output methods to register
     */
    add (
        id: ColorSpaceId,
        methods: OutputMethods
    ) : void {

        this.registry.set( id, methods );

    }

    /**
     * Retrieve registered output methods for a color space.
     * 
     * @param id - Color space ID
     * @returns Output methods
     */
    get (
        id: ColorSpaceId
    ) : OutputMethods | undefined {

        return this.registry.get( id );

    }

}

/**
 * Main output engine.
 * Tries to use color space output methods or uses fallbacks.
 */
export class Output {

    constructor (
        private registry: OutputRegistry
    ) {}

    /**
     * Converts a color object to a string representation.
     * 
     * @param color - Color representation
     * @returns Output color as a string
     */
    toString (
        color: ColorObject
    ) : string {

        const methods = this.registry.get( color.space );

        if ( methods?.toString ) {

            return methods.toString( color );

        }

        return JSON.stringify( color.value );

    }

    /**
     * Converts a color object to a JSON-serializable structure.
     * 
     * @param color - Color representation
     * @returns -serializable structure
     */
    toJSON (
        color: ColorObject
    ) : unknown {

        const methods = this.registry.get( color.space );

        if ( methods?.toJSON ) {

            return methods.toJSON( color );

        }

        return {
            space: color.space,
            value: color.value
        };

    }

}

/**
 * Singleton instances of the ouput system and its registry
 */
export const outputRegistry = new OutputRegistry ();
export const output = new Output ( outputRegistry );