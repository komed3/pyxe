/**
 * Registry
 * src/registy.ts
 * 
 * The Registry class provides a central place to register all decentralized modules, including
 * in particular color spaces, but also other components such as color tables (libraries, e.g.
 * RAL, HTML, …), calculation modules (e.g. for contrast or color distance) and much more. The
 * registry is a distributor for other services, such as color space parsers, output methods,
 * transformations, etc. and is deeply rooted within the core package.
 * 
 * The registry is called automatically by loaded packages and provides all the methods
 * required for subsequent calculations, transformations and so on. The registry can check
 * whether mandatory components are missing and provide precise information.
 * 
 * @package @pyxe/core
 * @requires @pyxe/types
 * 
 * @author Paul Köhler
 * @license MIT
 */

import type {
    ColorSpaceId,
    ColorSpaceRegistrationOptions
} from '@pyxe/types';

import {
    validatorRegistry,
    validator,
    type Validator
} from './validator.js';

import {
    parserRegistry,
    parser,
    type Parser
} from './parser.js';

import {
    conversionGraphRegistry,
    conversionGraph,
    type ConversionGraph
} from './graph.js';

import {
    outputRegistry,
    output,
    type Output
} from './output.js';

/**
 * Central registry class for managing color space modules.
 */
export class ColorSpaceRegistry {

    private registry: Set<ColorSpaceId> = new Set ();

    /**
     * Register a new color space module with all its features.
     * 
     * @param options - Configuration for the new color space
     */
    add (
        options: ColorSpaceRegistrationOptions
    ): void {

        const { id, validator, parser, conversions, outputs } = options;

        /** Register color space */
        this.registry.add( id );

        /** Register validator */
        if ( validator ) {

            validatorRegistry.add( id, validator );

        }

        /** Register parser module */
        if ( parser ) {

            parserRegistry.add( id, parser );

        }

        /** Register conversions */
        if ( conversions ) {

            conversionGraphRegistry.addMany( id, conversions );

        }

        /** Register output methods */
        if ( outputs ) {

            outputRegistry.add( id, outputs );

        }

    }

    /**
     * Returns all registered color spaces.
     * 
     * @returns Set of registered color spaces
     */
    getSpaces () : Set<ColorSpaceId> {

        return this.registry;
    
    }

    /**
     * Returns the validator class.
     * 
     * @returns Validator class
     */
    getValidator () : Validator {

        return validator;

    }

    /**
     * Returns the parser class.
     * 
     * @returns Parser class
     */
    getParser () : Parser {

        return parser;

    }

    /**
     * Returns the conversion graph class.
     * 
     * @returns ConversionGraph class
     */
    getConversionGraph () : ConversionGraph {

        return conversionGraph;

    }

    /**
     * Returns the output class.
     * 
     * @returns Output class
     */
    getOutput () : Output {

        return output;

    }

}

/**
 * Singleton instance of the pyxe registries.
 */
export const colorSpaceRegistry = new ColorSpaceRegistry ();