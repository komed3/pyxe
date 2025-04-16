/**
 * Class Output
 * src/lib/output.ts
 * 
 * The `Output` class provides centralized formatting capabilities for `ColorObject`
 * instances.
 * 
 * It dynamically delegates string and JSON output operations to the appropriate handlers
 * defined by the color space’s output configuration. If no handler is defined for a
 * requested format, the class returns a minimal fallback or throws a detailed error,
 * depending on the method used.
 * 
 * Color spaces may define their own output behavior by implementing one or more output
 * handlers under the keys `string`, `json`, or any other `OutputTypes` format.
 * 
 * This class is stateless and static, serving as a utility layer between internal
 * representations and user-facing outputs. Typical usage is handled internally by the
 * `Color` class, but direct usage of `Output.toString()`, `Output.toJSON()`, or
 * `Output.format()` is also supported.
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
    ColorSpaceID, ColorObject, OutputTypes,
    OutputHandler, ColorSpaceFactory
} from '@pyxe/types';

import { Utils } from '@pyxe/utils';
import { colorSpace } from './colorSpace.js';

/**
 * Utility class for formatting ColorObject instances.
 * This class cannot be instantiated. All methods are static.
 */
export class Output {

    /**
     * Retrieves the output handler for a given color space and format type.
     * 
     * @param id - The identifier of the color space
     * @param format - The output format type (e.g. "string", "json")
     * @returns The output handler function, if defined and valid
     */
    private static _getHandler (
        id: ColorSpaceID,
        format: OutputTypes
    ) : OutputHandler | undefined {

        if ( colorSpace.has( id ) ) {

            const { output } = colorSpace.get( id ) as ColorSpaceFactory;

            if (
                output && format in output &&
                typeof output[ format ] === 'function'
            ) {

                return output[ format ];

            }

        }

    }

    /**
     * Returns a formatted representation of a `ColorObject` using the specified format type.
     * 
     * Delegates the output to a color space-defined handler function. Throws an error
     * if no appropriate handler is found.
     * 
     * @param format - The output format type to apply (e.g. "string", "json", or custom)
     * @param input - The color object to be formatted
     * @returns The formatted output, of any type defined by the handler
     * @throws Error, if no handler exists for the requested format
     */
    static format (
        format: OutputTypes,
        input: ColorObject
    ) : unknown {

        const handler = this._getHandler(
            input.space, format
        );

        if ( handler ) {

            return handler( input );

        }

        throw new Utils.error( {
            method: 'Output',
            msg: `No output format <${format}> defined for color space <${input.space}>`
        } );

    }

    /**
     * Returns a string representation of the given `ColorObject`.
     * 
     * If a color space-specific "string" handler is defined, it is used. Otherwise, a
     * minimal fallback string is returned in the format `[space] {value}`.
     *  
     * @param input - The color object to stringify
     * @returns A string representation of the color
     */
    static toString (
        input: ColorObject
    ) : string {

        try {

            return this.format( 'string', input ) as string;

        } catch {

            return `[${ input.space }] ${
                JSON.stringify( input.value )
            }`;

        }

    }

    /**
     * Returns a JSON-compatible representation of the given `ColorObject`.
     * 
     * If a color space-specific `'json'` handler is defined, it is used. Otherwise,
     * a fallback object is returned containing the space ID and raw value.
     * 
     * @param input - The color object to convert
     * @returns An object suitable for JSON serialization
     */
    static toJSON (
        input: ColorObject
    ) : unknown {

        try {

            return this.format( 'json', input );

        } catch {

            return {
                space: input.space,
                value: input.value
            };

        }

    }

}