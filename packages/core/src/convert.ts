/**
 * Color Space Conversion
 * src/convert.js
 * 
 * The main Convert class represents the interface for all color space transformations
 * and attempts to convert color objects from their native color space to the desired
 * one. The class is based on the `ConversionGraph` and uses its path determination to
 * mediate between one color space and another. If no direct conversion is possible,
 * the class attempts to transform step by step.
 * 
 * Using the methods `tryConvert` and `tryConvertMany`, invalid or impossible
 * transformations do not throw an error, but return the input. This behavior can be
 * switched off using strict mode.
 * 
 * @package @pyxe/core
 * @requires @pyxe/types
 * 
 * @author Paul Köhler (komed3)
 * @license MIT
 */

import {
    ColorSpaceId,
    ColorObject
} from '@pyxe/types';

import {
    type ConversionGraph,
    conversionGraph
} from './graph.js';

import {
    debug,
    debugTemplates
} from './debug.js';

/**
 * Converts color objects from one into another color space.
 */
export class Convert {

    constructor (
        private graph: ConversionGraph
    ) {}

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

            const callback = this.graph.resolve( input.space, to );
            const result = callback( input );

            if ( debug.on() ) {

                debug.trace( result, debugTemplates.convert(
                    input, result,
                    this.graph.findPath( input.space, to )
                ) );

            }

            return result;

        } catch ( err ) {

            throw new Error (
                `Conversion from color space <${input.space}> to <${to}> has failed: ${err}`
            );

        }

    }

    /**
     * Converts an array of color objects.
     * 
     * @param input - Array of color objects
     * @param to - Target color space ID
     * @returns Array of converted color objects
     * @throws Throws an error, if one conversion has failed
     */
    convertMany (
        input: ColorObject[],
        to: ColorSpaceId
    ) : ColorObject[] {

        try {

            return input.map(
                ( obj ) => this.convert( obj, to )
            );

        } catch ( err ) {

            throw err;

        }

    }

    /**
     * Tries to convert a color from one into another color space.
     * Strict mode catches Errors while conversion.
     * 
     * @param input - Any input, maybe convertable color object
     * @param to - Target color space ID
     * @param strict - Enable strict mode
     * @returns Converted color object or input
     * @throws Throws an error, if strict mode is enabled and the conversion has failed
     */
    tryConvert (
        input: any,
        to: ColorSpaceId,
        strict: boolean = false
    ) : ColorObject | unknown {

        try {

            return ( input?.space && input?.value && input.space !== to )
                ? ( strict
                    ? this.convert( input, to )
                    : ( () => {
                        try { return this.convert( input, to ); }
                        catch { return input; }
                    } )()
                )
                : input;

        } catch ( err ) {

            throw new Error (
                `Strict mode: The color space conversion has failed: ${err}`
            );

        }

    }

    /**
     * Tries to convert an array of color objects.
     * Strict mode catches Errors while conversion.
     * 
     * @param input - Any input, maybe array of color objects
     * @param to - Target color space ID
     * @param strict - Enable strict mode
     * @returns Array of converted color object or input
     * @throws Throws an error, if strict mode is enabled and one of the conversions has failed
     */
    tryConvertMany (
        input: any,
        to: ColorSpaceId,
        strict: boolean = false
    ) : ColorObject[] | ColorObject | unknown {

        try {

            return Array.isArray( input )
                ? input.map( ( obj ) => this.tryConvert( obj, to, strict ) )
                : this.tryConvert( input, to, strict );

        } catch ( err ) {

            throw new Error (
                `Strict mode: A color space conversion has failed: ${err}`
            );

        }

    }

}

/**
 * Singleton instance for the converion class
 */
export const convert = new Convert ( conversionGraph );