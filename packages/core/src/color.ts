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

import type {
    ColorInput,
    ColorObject,
    ColorSpaceId
} from '@pyxe/types';

import { parser } from './parser.js';
import { validator } from './validator.js';
import { conversionGraph } from './graph.js';
import { output } from './output.js';

/**
 * The main Color class serves as the central user API.
 */
export class Color {

    private color: ColorObject;

    private constructor (
        color: ColorObject
    ) {

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

            const parsed = parser.parse( input );

            validator.validate( parsed.space, parsed.value );

            return new Color( parsed );

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
     * @throws Throws an error, if the input cannot be validated
     */
    static from (
        input: ColorObject
    ) : Color {

        try {

            validator.validate( input.space, input.value );

            return new Color( input );

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

            const converted = conversionGraph.convert( this.color, target );

            return new Color( converted );

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

        return output.toString( this.color );

    }

    /**
     * Converts this color to a serializable JSON object.
     * 
     * @returns JSON-compatible color object
     */
    toJSON () : unknown {

        return output.toJSON( this.color );

    }

    /**
     * Returns the current color space ID.
     * 
     * @returns Color space identifier
     */
    getSpace () : ColorSpaceId {

        return this.color.space;

    }

}