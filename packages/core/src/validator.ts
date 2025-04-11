/**
 * Validator
 * src/validator.ts
 * 
 * Provides a registry-based system to associate color validators with specific color spaces.
 * A validator takes an arbitrary input and returns a fully normalized and validated color
 * object. If no validation callback has been registered for a color space or the color is
 * not part of the given color space, the validator throws an error.
 *  
 * @package @pyxe/core
 * @requires @pyxe/types
 * 
 * @author Paul Köhler
 * @license MIT
 */

import type {
    ColorSpaceId,
    ColorInput,
    ColorObject,
    ValidatorCallback
} from '@pyxe/types';

/**
 * Registry for managing color space validators.
 */
export class ValidatorRegistry {

    private registry: Map<ColorSpaceId, ValidatorCallback> = new Map();

    /**
     * Adds a validator callback for a color space.
     * 
     * @param id - Color space ID
     * @param callback - Validator callback
     */
    add (
        id: ColorSpaceId,
        callback: ValidatorCallback
    ) : void {

        this.registry.set( id, callback );

    }

    /**
     * Retrieve the validator for a given color space.
     * 
     * @param id - Color space ID
     */
    get (
        id: ColorSpaceId
    ) : ValidatorCallback | undefined {

        return this.registry.get( id );

    }

    /**
     * Check whether a validator exists for a given color space.
     * 
     * @param id - Color space ID
     */
    has (
        id: ColorSpaceId
    ) : boolean {

        return this.registry.has( id );

    }

}

/**
 * Validator class to check whether a color belongs to a color space.
 * Returns a valid color object or throws an error.
 */
export class Validator {

    constructor (
        private registry: ValidatorRegistry
    ) {}

    /**
     * 
     * @param id - Color space ID
     * @param input - User input to be validated
     * @returns Validated color object
     * @throws Throws an error if validator is missing or validation fails
     */
    validate (
        id: ColorSpaceId,
        input: ColorInput
    ) : ColorObject {

        const callback = this.registry.get( id );

        if ( !callback ) {

            throw new Error(
                `No validator registered for color space <${id}>`
            );

        }

        try {

            return callback( input );

        } catch ( err ) {

            throw new Error(
                `Validation failed for color space <${id}>: ${ ( err as Error ).message }`
            );

        }

    }

    /**
     * Checks, if a color belongs to a color space.
     * 
     * @param id - Color space ID
     * @param input - User input to be validated
     * @returns True, if valid color, false otherwise
     */
    is (
        id: ColorSpaceId,
        input: ColorInput
    ) : boolean {

        try {

            this.validate( id, input );

        } catch {

            return false;

        }

        return true;

    }

}

/**
 * Singleton instance of the validator and its registry
 */
export const validatorRegistry = new ValidatorRegistry ();
export const validator = new Validator ( validatorRegistry );