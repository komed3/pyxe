/**
 * Color Class
 * src/color.ts
 * 
 * This file contains the central Color class, which acts as the primary API for interacting
 * with colors in the pyxe framework. It connects to the parser, validator, conversion graph,
 * and output modules, and allows users to easily create, transform and serialize colors
 * across various supported color spaces.
 * 
 * @package @pyxe/core
 * @requires @pyxe/types
 * 
 * @author Paul Köhler
 * @license MIT
 */

'use strict';

import type {
    ColorSpaceId,
    ColorInput,
    ColorObject,
    ModuleFactory
} from '@pyxe/types';

import { registry } from './registry.js';
import { parser } from './parser.js';
import { validator } from './validator.js';
import { colorLib } from './library.js';
import { convert } from './convert.js';
import { output } from './output.js';
import { module } from './module.js';

/**
 * The main Color class serves as the central user API.
 */
export class Color {

    private color: ColorObject;

    private constructor (
        color: ColorObject
    ) {

        /** Checks if the color space is registered */
        registry.check( color.space );

        /** Validates the color object or throws an error */
        validator.validate( color.space, color.value );

        this.color = color;

    }

    /**
     * Validates a color input against a color space.
     * 
     * @static
     * @param id - Color space ID
     * @param input - Color object to validate
     * @returns True, if valid color, false otherwise
     */
    static validate (
        id: ColorSpaceId,
        input: ColorInput
    ) : boolean {

        return validator.is( id, input );

    }

    /**
     * Parses and validates a string or object into a Color instance.
     * 
     * @static
     * @param input - Input color value
     * @returns Color instance
     * @throws Throws an error, if the input cannot be parsed or validated
     */
    static parse (
        input: ColorInput
    ) : Color {

        try {

            return new Color (
                parser.parse( input )
            );

        } catch ( err ) {

            throw err;

        }

    }

    /**
     * Creates a Color from a given color object.
     * 
     * @static
     * @param input - A valid color object
     * @returns Color instance
     */
    static from (
        input: ColorObject
    ) : Color {

        return new Color ( input );

    }

    /**
     * Creates a Color instance from a color, registered in a library.
     * 
     * @param libId - Library ID
     * @param colorId - Color key (e.g., 'RAL 1000')
     * @param preferredSpaces - Preferred color spaces
     * @param options - Additional options, e.g. strict mode
     * @returns Color instance
     * @throws Throws an error, if the color cannot be loaded from the library
     */
    static fromLib (
        libId: string,
        colorId: string,
        preferredSpaces?: ColorSpaceId[] | ColorSpaceId,
        options?: {
            strict?: boolean
        }
    ) : Color {

        try {

            return new Color (
                colorLib.from( libId, colorId, preferredSpaces, options )
            );

        } catch ( err ) {

            throw err;

        }

    }

    /**
     * Converts this color to another color space and returns a new Color instance.
     * 
     * @param target - Target color space ID
     * @returns Color instance in new space
     * @throws Throws an error, if the color cannot be converted
     */
    convert (
        target: ColorSpaceId
    ) : Color {

        try {

            return new Color (
                convert.convert( this.toObject(), target )
            );

        } catch ( err ) {

            throw err;

        }

    }

    /**
     * Converts this color to a plain color object.
     * 
     * @returns Raw color object
     */
    toObject () : ColorObject {

        return this.color;

    }

    /**
     * Serializes this color to a string using the appropriate output method.
     * 
     * @returns Formatted string
     */
    toString () : string {

        return output.toString( this.toObject() );

    }

    /**
     * Converts this color to a serializable JSON object.
     * 
     * @returns JSON-compatible color object
     */
    toJSON () : unknown {

        return output.toJSON( this.toObject() );

    }

    /**
     * Returns the current color space ID.
     * 
     * @returns Color space identifier
     */
    getSpace () : ColorSpaceId {

        return this.toObject().space;

    }

    /**
     * Applying a module to execute a calculation.
     * 
     * @param id - Module name
     * @param args - Additional colors or parameters (ColorObject[], options?, strict?)
     * @returns Color instance(s) or the handlers return value
     * @throws Throws an error, if the calculation cannot be executed
     */
    apply (
        id: string,
        ...args: any[]
    ) : Color | Color[] | any {

        const result = module.apply(
            id, this.toObject(),
            ...args
        );

        if ( result && typeof result === 'object' ) {

            if ( Array.isArray( result ) ) {

                return result.every( ( obj ) => obj?.space && obj?.value )
                    ? result.map( ( obj ) => new Color( obj ) )
                    : result;

            }

            if ( result.space && result.value ) {

                return new Color( result );

            }

        }

        return result;

    }

}

/**
 * Dynamically adds methods to the Color class to call modules.
 */
export const ColorMethodRegistry = {

    /**
     * Adds a new method to the Color class
     * 
     * @param module - Module definition
     * @throws Throws an error, if the method cannot be added
     */
    add (
        module: ModuleFactory
    ) : void {

        const { id, exposeAsMethod = false } = module;

        if ( exposeAsMethod && ! ( id in Color.prototype ) ) {

            ( Color.prototype as any )[ id ] = function (
                ...args: any[]
            ) : Color | Color[] | any {

                return this.apply( id, ...args );

            };

        } else {

            throw new Error (
                `Cannot add method for module <${id}> to the Color class.`
            );

        }

    }

};