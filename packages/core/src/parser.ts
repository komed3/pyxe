/**
 * Color Space Parser
 * src/parser.ts
 * 
 * The parser class is used for detecting colors automatically and is a principal part of
 * the core package. Each color space dynamically registers a function as a parser callback
 * via the registry. These are processed by the parser in sequence until a function returns
 * a matching result and the corresponding color space is found. The return value contains
 * a fully parsed and validated color in the detected color space.
 * 
 * If the parser cannot find a color space for a specified color, an error is thrown
 * indicating that either the user input is incorrect or that no corresponding color
 * space was found.
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
    ColorSpaceId,
    ColorInput,
    ColorObject,
    ParserCallback
} from '@pyxe/types';

import {
    debug,
    debugTemplates
} from '@pyxe/utils';

/**
 * Registry managing all available parser functions for known color spaces.
 */
export class ParserRegistry {

    private registry: Map<ColorSpaceId, ParserCallback> = new Map ();

    /**
     * Adds a parser for a specific color space ID.
     * 
     * @param id - Color space ID
     * @param callback - Parser callback
     */
    add (
        id: ColorSpaceId,
        parser: ParserCallback
    ) : void {

        this.registry.set( id, parser );

    }

    /**
     * Returns all registered parsers.
     * 
     * @returns Map of registered parsers
     */
    getAll () : Map<ColorSpaceId, ParserCallback> {

        return this.registry;

    }

    /**
     * Retrieves a parser by ID.
     * 
     * @param id - Color space ID
     */
    get (
        id: ColorSpaceId
    ) : ParserCallback | undefined {

        return this.registry.get( id );

    }

}

/**
 * Core parser engine that attempts to detect and parse color inputs.
 * It queries all registered parser functions until one returns a valid result.
 */
export class Parser {

    constructor (
        private registry: ParserRegistry
    ) {}
  
    /**
     * Attempts to parse the input using registered color parsers.
     * Returns a fully parsed and validated ColorObject object or throws an error.
     * 
     * @param input - Color input
     * @returns Parsed color object
     * @throws Throws an error if input isn't parseable
     */
    parse (
        input: ColorInput
    ) : ColorObject {

        for ( const callback of this.registry.getAll().values() ) {

            try {

                const result = callback( input );

                if ( result ) {

                    if ( debug.on() ) {

                        debug.trace( result, debugTemplates.parse(
                            input, result
                        ) );

                    }

                    return result;

                }

            } catch {

                /**
                 * Individual parser failed, continue
                 */

            }

        }

        throw new Error(
            `No suitable parser found for input: ${ JSON.stringify( input ) }`
        );

    }

    /**
     * Checks if a color input is parseable.
     * 
     * @returns Returns true if parseable, false instead
     */
    canParse (
        input: ColorInput
    ) : boolean {

        try {

            this.parse( input );

            return true;

        } catch {

            return false;

        }

    }

}

/**
 * Singleton instances of the global parser and its registry.
 */
export const parserRegistry = new ParserRegistry ();
export const parser = new Parser ( parserRegistry );