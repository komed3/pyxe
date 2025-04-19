/**
 * Class Color
 * src/lib/color.ts
 * 
 * This module defines the central `Color` class—the primary user-facing API of
 * the pyxe framework.
 * 
 * The `Color` class encapsulates a single `ColorObject` instance and provides
 * a unified interface for:
 * 
 * - creating colors from raw objects, parsed input, or external color libraries
 * - converting between color spaces using the centralized conversion graph
 * - formatting color values into different output formats
 * - applying dynamic operations through registered calculation modules
 * - validating and inspecting the underlying color structure
 * 
 * In addition, the `ColorMethodRegistry` provides runtime binding of module
 * functions directly to the `Color` class, allowing for dynamic extension of
 * its capabilities (e.g. `color.invert()`).
 * 
 * This class serves as the main entry point for all color-related operations
 * across the pyxe ecosystem.
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
    ColorInput, ColorInstance, ColorObject,
    ColorSpaceID, OutputTypes
} from '@pyxe/types';

import { Utils } from '@pyxe/utils';
import { Validator } from './validator.js';
import { Parser } from './parser.js';
import { ColorLib } from './colorLib.js';
import { Output } from './output.js';
import { colorSpace } from './colorSpace.js';
import { convert } from './convert.js';
import { module } from './module.js';

/**
 * The `Color` class represents the central API for interacting with colors
 * in the pyxe framework. It allows creation from various sources, parsing,
 * conversion between color spaces, formatting, and the application of
 * dynamic color operations.
 */
export class Color {

    /** The internal color representation */
    private color: ColorObject;

    /**
     * Constructs a new `Color` instance from a validated `ColorObject`.
     * Use static methods like `Color.parse()` or `Color.from()` instead
     * of calling this constructor directly.
     * 
     * @param color - A fully validated and typed color object
     */
    private constructor (
        color: ColorObject
    ) {

        colorSpace.check( color.space );

        Validator.validate( color, true );

        this.color = color;

    }

    /**
     * Checks whether a given object is a valid `ColorObject`.
     * This is a non-throwing check and returns a boolean.
     * 
     * @param input - The object to verify
     * @returns `true` if the input matches the expected structure, `false` otherwise
     */
    static isColor (
        input: ColorObject
    ) : boolean {

        return Validator.validate( input );

    }

    /**
     * Creates a `Color` instance from a validated `ColorObject`.
     * Assumes the input is already valid and throws if not.
     * 
     * @param input - A validated color object
     * @returns A new Color instance
     */
    static from (
        input: ColorObject
    ) : Color {

        return new Color ( input );

    }

    /**
     * Parses and validates color input from strings, numbers, arrays, or objects.
     * Automatically detects the appropriate color space.
     * 
     * @param input - The raw input value
     * @returns A new Color instance
     * @throws If the parser fails or the resulting color is invalid
     */
    static parse (
        input: ColorInput
    ) : Color {

        try {

            return new Color (
                Parser.parse( input ) as ColorObject
            );

        } catch ( err ) {

            throw new Utils.error( {
                err, method: 'Color',
                msg: `Failed to load parsed color`
            } );

        }

    }

    /**
     * Loads a color from a named color library (e.g., RAL, HTML, etc.).
     * Accepts a color ID and optional preferences such as color spaces
     * or matching behavior.
     * 
     * @param colorLib - The identifier of the color library
     * @param colorID - The color's unique identifier within the library
     * @param preferredSpaces - Optional list of target spaces, ordered by priority
     * @param options - Additional options for loading, conversion, or strictness
     * @returns A promise resolving to a Color instance
     */
    static async fromLib (
        colorLib: string,
        colorID: string,
        preferredSpaces?: ColorSpaceID[],
        options: {
            sources?: string[];
            strict?: boolean;
            tryConvert?: boolean;
        } = {}
    ) {

        try {

            const lib = ColorLib.getInstance( colorLib );

            return new Color(
                await lib.getColor(
                    colorID, preferredSpaces, options
                ) as ColorObject
            );

        } catch ( err ) {

            throw new Utils.error( {
                err, method: 'Color',
                msg: `Failed to load color <${colorID}> from library <${colorLib}>`
            } );

        }

    }

    /**
     * Validates the current color instance against its color space specification.
     * 
     * @returns `true` if valid, `false` otherwise
     */
    validate () : boolean {

        return Validator.validate( this.color );

    }

    /**
     * Checks whether the color is an instance of the specified color space.
     * 
     * @returns `true` if the internal value structure matches the space definition
     */
    instanceOf (
        space: ColorSpaceID
    ) : boolean {

        try {

            Validator.instanceOf( space, this.color.value );

        } catch {

            return false;

        }

        return true;

    }

    /**
     * Returns the raw `ColorObject` of this instance.
     * Can be used for low-level inspection or transformation.
     * 
     * @returns The internal ColorObject
     */
    toObject () : ColorObject {

        return this.color;

    }

    /**
     * Returns a string representation of the color, using the
     * preferred output format of the color space.
     * 
     * @param options - Optional arguments to pass to the handler
     * @returns A stringified representation of the color
     */
    toString (
        options?: Record<string, any>
    ) : string {

        return Output.toString( this.toObject(), options );

    }

    /**
     * Returns a JSON-compatible representation of the color.
     * Format may vary by color space and configuration.
     * 
     * @param options - Optional arguments to pass to the handler
     * @returns JSON-encoded color object
     */
    toJSON (
        options?: Record<string, any>
    ) : unknown {

        return Output.toJSON( this.toObject(), options );

    }

    /**
     * Formats the color according to the specified output type
     * (e.g., "string", "object", "array").
     * 
     * @param format - The desired output type
     * @param options - Optional arguments to pass to the handler
     * @returns The formatted color output
     */
    format (
        format: OutputTypes,
        options?: Record<string, any>
    ) : unknown {

        return Output.format( format, this.toObject(), options );

    }

    /**
     * Converts this color into another color space.
     * 
     * @param target - The target color space identifier
     * @returns A new Color instance in the target space
     * @throws If the conversion fails or no path exists
     */
    convert (
        target: ColorSpaceID
    ) : Color {

        try {

            return new Color (
                convert.convert( this.toObject(), target ) as ColorObject
            );

        } catch ( err ) {

            throw new Utils.error( {
                err, method: 'Color',
                msg: `Failed to convert into <${target}> color space`
            } );

        }

    }

    /**
     * Attempts to convert the color into another color space.
     * Will return the original color if conversion fails.
     * 
     * @param target - The target color space identifier
     * @returns A Color instance in the target space, or fallback
     */
    tryConvert (
        target: ColorSpaceID
    ) : Color {

        return new Color (
            convert.tryConvert( this.toObject(), target ) as ColorObject
        );

    }

    /**
     * Returns the current color space of this instance.
     * 
     * @returns The color space ID
     */
    getSpace () : ColorSpaceID {

        return this.toObject().space;

    }

    /**
     * Returns the raw value of the color (excluding metadata).
     * 
     * @returns The color value tuple or object
     */
    getInstance () : ColorInstance {

        return this.toObject().value;

    }

    /**
     * Retrieves the metadata from the color instance.
     * 
     * @return The color object meta or undefined
     */
    getMeta () : Record<string, any> | undefined {

        return this.toObject()?.meta;

    }

    /**
     * Applies a registered calculation or operation module to the color.
     * This is the core method for dynamic color operations such as
     * invert, lighten, blend, etc.
     * 
     * @param key - The module method identifier
     * @param args - Optional arguments passed to the module
     * @returns The transformed result (Color, Color[], or any)
     */
    apply (
        key: string,
        ...args: any[]
    ) : Color | Color[] | any {

        const result = module.apply(
            key, this.toObject(),
            ...args
        );

        if ( result && typeof result === 'object' ) {

            if ( Array.isArray( result ) ) {

                return result.map(
                    ( res ) => res?.space && res?.value
                        ? new Color ( res )
                        : res
                );

            }

            if ( result?.space && result?.value ) {

                return new Color( result );

            }

        }

        return result;

    }

};

/**
 * The `ColorMethodRegistry` allows for the dynamic binding and unbinding
 * of color manipulation functions (e.g., `.invert()`, `.lighten()`) directly
 * to the `Color` class at runtime. These methods are backed by modular
 * function handlers that can be registered independently.
 */
export const ColorMethodRegistry = {

    /**
     * Dynamically attaches a new method to the `Color` prototype.
     * This allows registered modules to be exposed as convenient methods.
     * 
     * @param method - The internal module method key
     * @param name - The name to expose on `Color.prototype`
     * @throws If the method cannot be bound to `Color`
     */
    bind (
        method: string,
        name: string
    ) : void {

        try {

            if ( ! ( name in Color.prototype ) ) {

                ( Color.prototype as any )[ name ] = function (
                    ...args: any[]
                ) : Color | Color[] | any {

                    return this.apply( method, ...args );

                };

            }

        } catch ( err ) {

            throw new Utils.error( {
                err, method: 'ColorMethodRegistry',
                msg: `Cannot bind method <${method}> as <${name}> to the Color class.`
            } );

        }

    },

    /**
     * Removes a previously bound method from the `Color` class prototype.
     * 
     * @param key - The method name to remove
     * @throws If the method does not exist.
     */
    unbind (
        key: string
    ) : void {

        if ( key in Color.prototype ) {

            delete ( Color.prototype as any )[ key ];

        } else {

            throw new Utils.error( {
                method: 'ColorMethodRegistry',
                msg: `Method <${key}> is not bound to the Color class`
            } );

        }

    }

};