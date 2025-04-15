/**
 * Class Validator
 * src/lib/validator.ts
 * 
 * The `Validator` class provides a centralized interface for validating color objects
 * against specific color space definitions. It delegates the validation logic to the
 * validator function of the targeted color space, as retrieved via the `ColorSpace`
 * registry.
 * 
 * This validator ensures that input values conform to the expected structure and coordinate
 * boundaries for a given color space. If a space does not implement a validator, a failure
 * is automatically reported via the `ErrorHandler`.
 * 
 * Like the `Parser`, this module is intentionally standalone for modularity and to
 * support potential server-side validation use cases.
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
    ColorSpaceID, ColorObject,
    ColorSpaceFactory
} from '@pyxe/types';

import { Utils } from '@pyxe/utils';
import { colorSpace } from './colorSpace.js';

/**
 * Color object validator for registered color spaces.
 * Delegates to space-specific `validator()` implementations stored in the registry.
 * This class cannot be instantiated. All methods are static.
 */
export class Validator {

    /**
     * Validates a given color object against the specified color space.
     * 
     * Delegates to the color space’s registered `validator()` function. If validation fails
     * or the validator is missing, an error is thrown. Otherwise, a standardized `ColorObject`
     * is returned.
     * 
     * @param space - The ID of the color space to validate against (e.g., 'RGB', 'Lab')
     * @param input - The raw color object to be validated
     * @returns A validated `ColorObject` representing the input
     * @throws If validation fails or the color space is unknown
     */
    static validate (
        space: ColorSpaceID,
        input: ColorObject
    ) : ColorObject | undefined {

        try {

            const { validator: handler } = colorSpace.get( space ) as ColorSpaceFactory;

            return handler( input );

        } catch ( err ) {

            throw new Utils.error( {
                err, method: 'Validator',
                msg: `Validation failed for color space <${space}> with input <${
                    JSON.stringify( input )
                }>`
            } );

        }

    }

    /**
     * Lightweight validation check for a specific color space.
     * 
     * This method returns a boolean indicating whether the input passes validation,
     * without throwing an error or returning the parsed result. Useful for pre-checks.
     * 
     * @param space - Target color space to check
     * @param input - The color object to validate
     * @returns `true` if the input is valid, otherwise `false`
     */
    static try (
        space: ColorSpaceID,
        input: ColorObject
    ) : boolean {

        try {

            this.validate( space, input );

        } catch {

            return false;

        }

        return true;

    }

}