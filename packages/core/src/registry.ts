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
    parserRegistry,
    conversionGraphRegistry,
    outputRegistry
} from './index.js';

/**
 * Central registry class for managing color space modules and extensions.
 */
export class Registry {

    private spaces: Set<ColorSpaceId> = new Set ();

    /**
     * Register a new color space module with all its features.
     * 
     * @param options - Configuration for the new color space
     */
    addColorSpace (
        options: ColorSpaceRegistrationOptions
    ): void {

        const { id, validator, parser, conversions, outputs } = options;

        /** Register color space */
        this.spaces.add( id );

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

}

/**
 * Singleton instance of the pyxe Registry
 */
export const registry = new Registry ();