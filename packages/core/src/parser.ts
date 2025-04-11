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
 * 
 * @author Paul Köhler (komed3)
 * @license MIT
 */

import type { ColorInput, ParsedColor, ColorSpaceId } from '@pyxe/types';

/**
 * Type definition for a parser callback.
 * Each parser attempts to match and convert the input to a specific color model.
 */
export type ParserCallback = ( input: ColorInput ) => ParsedColor | undefined;

/**
 * Type definition for the parser map.
 */
export type ParserMap = Map<ColorSpaceId, ParserCallback>;

/**
 * Registry managing all available parser functions for known color spaces.
 */
export class ParserRegistry {

    private registry: ParserMap = new Map ();

    /**
     * Registers a parser for a specific color space ID.
     * 
     * @param id - Color space ID
     * @param callback - Parser callback
     */
    register (
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
    getAll () : ParserMap {

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
     * Returns a fully parsed and validated ParsedColor object or throws an error.
     * 
     * @param input - Color input
     * @returns Parsed color object
     * @throws Throws an error if input isn't parseable
     */
    parse (
        input: ColorInput
    ) : ParsedColor {

        for ( const [ , callback ] of this.registry.getAll() ) {

            try {

                const result = callback( input );

                if ( result ) {

                    return result as ParsedColor;

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

        for ( const callback of this.registry.getAll().values() ) {

            try {

                if ( callback( input ) ) return true;

            } catch {

                continue;

            }

        }

        return false;

    }

}

/**
 * Singleton instances of the global parser and parser registry
 */
export const parserRegistry = new ParserRegistry ();
export const colorParser = new Parser ( parserRegistry );