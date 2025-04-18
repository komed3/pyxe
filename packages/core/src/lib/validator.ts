/**
 * Class Validator
 * src/lib/validator.ts
 * 
 * The `Validator` class provides a centralized interface for validating color objects
 * or instances against specific color space definitions. It delegates the validation
 * logic to the validator function of the targeted color space, as retrieved via the
 * `ColorSpace` registry.
 * 
 * This validator ensures that input values conform to the expected structure and coordinate
 * boundaries for a given color space. If a space does not implement a validator, a failure
 * is automatically reported via the `PyxeError` utils class.
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

import type { ColorSpaceID, ColorObject, ColorInstance, ColorSpaceFactory } from '@pyxe/types';
import { Utils } from '@pyxe/utils';
import { colorSpace } from './colorSpace.js';

/**
 * Color object validator for registered color spaces.
 * Delegates to space-specific `validator()` implementations stored in the registry.
 * This class cannot be instantiated. All methods are static.
 */
export class Validator {

    /**
     * Validates a given color instance against a color space.
     * 
     * @param space - The ID of the color space to validate against (e.g., 'RGB', 'Lab')
     * @param input - The color instance to be validated
     * @returns `true` if the input matches, `false` otherwise
     */
    static instanceOf (
        space: ColorSpaceID,
        input: ColorInstance
    ) : boolean {

        if ( colorSpace.check( space ) ) {

            try {

                const { validator: handler } = colorSpace.get( space ) as ColorSpaceFactory;

                return handler( { space, value: input } );

            } catch ( err ) {

                throw new Utils.error( {
                    err, method: 'Validator',
                    msg: `No validator defined for color space <${space}>`
                } );

            }

        }

        return false;

    }

    /**
     * Validates a given color object.
     * 
     * Delegates to the color space’s registered `validator()` function. If validation fails
     * and safe mode ist on, an error is thrown. Otherwise, the function returns `true` on
     * success and `false` otherwise.
     * 
     * @param input - The color object to be validated
     * @returns `true` if the input matches, `false` otherwise
     * @throws If validation fails (safe mode) or the color space is unknown
     */
    static validate (
        input: ColorObject,
        safe: boolean = false
    ) : boolean {

        if ( this.instanceOf( input.space, input.value ) ) {

            return true;

        } else if ( safe ) {

            throw new Utils.error( {
                method: 'Validator',
                msg: `Validation failed for color space <${input.space}> with input <${
                    JSON.stringify( input )
                }>`
            } );

        }

        return false;

    }

}