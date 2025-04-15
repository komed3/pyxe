/**
 * Class Parser
 * src/lib/parser.js
 * 
 * The `Parser` class provides a unified interface for parsing arbitrary color input into
 * internal `ColorObject` representations. It iterates over all registered color spaces,
 * attempting to delegate the parsing task to their respective `parser()` functions.
 * 
 * The parser logic is fully static and uses the central `colorSpace` registry to access
 * all known parsing strategies. Tracing is supported via the `tracer` utility and
 * integrates seamlessly into the parse flow.
 * 
 * This component is intentionally isolated in its own module to remain modular,
 * testable, and reusable – even though its behavior is driven entirely by
 * the dynamically registered color spaces.
 * 
 * Errors are thrown via the central `ErrorHandler` and include helpful context
 * for debugging or reporting issues in custom input.
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
    ColorInput, ColorObject,
    ColorSpaceFactory
} from '@pyxe/types';

import { Utils } from '@pyxe/utils';
import { colorSpace } from './colorSpace.js';

/**
 * Unified color parser that delegates to all registered color spaces.
 * This class cannot be instantiated. All methods are static.
 */
export class Parser {

    /**
     * Attempts to parse a given color input using all registered color space parsers.
     * 
     * The method returns the first successful `ColorObject`, or throws an error if
     * no parser accepts the input. Parsing success is automatically traced if enabled.
     * 
     * @param input - The color input to be parsed (string, array, object, etc.)
     * @returns A validated `ColorObject` with color coordinates and metadata
     * @throws If no registered parser can handle the input
     */
    static parse (
        input: ColorInput
    ) : ColorObject | undefined {

        try {

            for ( const space of colorSpace.getSpaces() ) {

                try {

                    const { parser: handler } = colorSpace.get( space ) as ColorSpaceFactory;

                    if ( handler && typeof handler === 'function' ) {

                        const result = handler( input );

                        if ( result ) {

                            if ( Utils.tracer.isReady() ) {

                                Utils.tracer._add( result, Utils.tracerTemplates.parse(
                                    input, result
                                ) );
        
                            }

                            return result as ColorObject;

                        }

                    }

                } catch {

                    /** Ignore individual parser errors and continue */

                }

            }

        } catch ( err ) {

            throw new Utils.error( {
                err, method: 'Parser',
                msg: `No suitable parser found for input <${
                    JSON.stringify( input )
                }>`
            } );

        }

    }

    /**
     * Tries to determine whether the input can be parsed successfully
     * without throwing an error.
     * 
     * This is a utility method useful for input validation, preview rendering, etc.
     * 
     * @param input - A color input to test
     * @returns `true` if the input is parsable, otherwise `false`
     */
    static try (
        input: ColorInput
    ) : boolean {

        try {

            this.parse( input );

        } catch {

            return false;

        }

        return true;

    }

}