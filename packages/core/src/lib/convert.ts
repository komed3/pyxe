/**
 * Class Convert
 * src/lib/convert.js
 * 
 * Provides color space conversion utilities based on the central `ConversionGraph`.
 * This class supports strict and fault-tolerant conversions and allows prioritizing
 * a list of fallback target color spaces in order of preference.
 * 
 * All conversions are tracked via a tracer if enabled. It is safe to use in
 * production environments due to internal error handling and optional strict
 * mode.
 * 
 * This class is *not* typically used directly by consumers of the library. Color
 * space conversions are performed directly via the central API using `Color.convert()`
 * or used internally by some modules.
 * 
 * @package @pyxe/core
 * @requires @pyxe/types
 * @requires @pyxe/utils
 * 
 * @author Paul Köhler (komed3)
 * @license MIT
 */

'use strict';

import type { ColorSpaceID, ColorObject } from '@pyxe/types';
import { Utils } from '@pyxe/utils';
import { conversionGraph, type ConversionGraph } from './graph.js';

/**
 * Handles conversion between color spaces using the central directed graph.
 * Supports fallback target spaces and strict vs. tolerant operation modes.
 */
export class Convert {

    /**
     * Creates a new Convert instance using the given conversion graph.
     * 
     * @param graph - The internal conversion graph used to resolve paths
     */
    constructor (
        private graph: ConversionGraph
    ) {}

    /**
     * Converts a color object from its current space to a target space or
     * the first successfully resolved space in a list of fallbacks.
     * 
     * @param input - The source color object
     * @param target - The target color space ID or an array of fallback space IDs
     * @returns The converted color object, or undefined if all targets fail
     * @throws Will rethrow the last encountered error if all attempts fail
     */
    convert (
        input: ColorObject,
        target: ColorSpaceID | ColorSpaceID[]
    ) : ColorObject | undefined {

        const targets = Array.isArray( target ) ? target : [ target ];

        try {

            for ( const t of targets ) {

                try {

                    const handler = this.graph.resolve( input.space, t );
                    const result = handler( input );

                    if ( result && Utils.tracer.isReady() ) {

                        Utils.tracer._add( result, Utils.tracerTemplates.convert(
                            input, result,
                            this.graph.findPath( input.space, t )
                        ) );

                    }

                    return result as ColorObject;

                } catch {

                    /** Skip failed target and continue */

                }

            }

        } catch ( err ) {

            throw new Utils.error( {
                err, method: 'Convert',
                msg: `Conversion from color space <${input.space}> to any of <${
                    targets.join( ', ' )
                }> has failed`
            } );

        }

    }

    /**
     * Converts an array of color objects to the given target space(s).
     * 
     * @param input - Array of source color objects
     * @param target - A single or list of fallback target color space IDs
     * @returns An array of converted color objects
     */
    convertMany (
        input: ColorObject[],
        target: ColorSpaceID | ColorSpaceID[]
    ) : ColorObject[] {

        try {

            return input.map(
                ( obj ) => this.convert( obj, target )
            ) as ColorObject[];

        } catch ( err ) {

            throw err;

        }

    }

    /**
     * Tries to convert a color object, optionally throwing if conversion fails.
     * Returns the input unchanged if conversion fails and strict mode is disabled.
     * 
     * @param input - The color object to convert
     * @param target - The target or list of fallback target spaces
     * @param strict - If true, throws on failure; otherwise returns original input
     * @returns The converted color object or the original input
     */
    tryConvert (
        input: any,
        target: ColorSpaceID | ColorSpaceID[],
        strict: boolean = false
    ) : ColorObject | unknown {

        try {

            return this.convert( input, target );

        } catch ( err ) {

            if ( strict ) {

                throw new Utils.error( {
                    err, method: 'Convert',
                    msg: `Strict mode: The color space conversion has failed`
                } );

            } else {

                return input;

            }

        }

    }

    /**
     * Tries to convert a single or array of color objects, optionally enforcing
     * strict failure mode.
     * 
     * @param input - The color object or array of objects to convert
     * @param target - The target or list of fallback target spaces
     * @param strict - If true, throws on failure; otherwise returns unchanged input(s)
     * @returns Converted object(s) or the original input(s)
     */
    tryConvertMany (
        input: any | any[],
        target: ColorSpaceID | ColorSpaceID[],
        strict: boolean = false
    ) : ColorObject[] | ColorObject | unknown {

        try {

            return Array.isArray( input )
                ? input.map( ( obj ) => this.tryConvert( obj, target, strict ) )
                : this.tryConvert( input, target, strict );

        } catch ( err ) {

            throw new Utils.error( {
                err, method: 'Convert',
                msg: `Strict mode: A color space conversion has failed`
            } );

        }

    }

}

/**
 * Singleton instance of the Convert class.
 * Used for color space conversions using the global conversion graph.
 */
export const convert = new Convert ( conversionGraph );