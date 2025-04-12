/**
 * Registry
 * src/registy.ts
 * 
 * The main registry class is implemented as an essential interface to dynamically add all
 * decentralized color spaces, making them available for calculations, transformations, etc.
 * The registry is merely a distributor for other services such as the color space parser,
 * output methods and transformations between color spaces and is deeply anchored in the
 * core package.
 * 
 * Loaded packages automatically call the registry, which delegates all methods that are
 * required for further calculations, transformations, etc. The registry can check whether
 * mandatory components are missing and provide precise information.
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

import { validatorRegistry } from './validator.js';
import { parserRegistry } from './parser.js';
import { conversionGraphRegistry } from './graph.js';
import { outputRegistry } from './output.js';

/**
 * Central registry class for managing color space modules.
 */
export class Registry {

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

        } else {

            console.warn(
                `Missing validator for color space <${id}> detected.`
            );

        }

        /** Register parser module */
        if ( parser ) {

            parserRegistry.add( id, parser );

        } else {

            console.warn(
                `Missing parser for color space <${id}> detected.`
            );

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

}

/**
 * Singleton instance of the pyxe color space registry.
 */
export const registry = new Registry ();