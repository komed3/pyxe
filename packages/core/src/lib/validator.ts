'use strict';

import type { ColorSpaceID, ColorInput, ColorObject, ColorSpaceFactory } from '@pyxe/types';

import { ErrorHandler } from '@pyxe/utils/lib/errorHandler.js';

import { colorSpace } from './colorSpace.js';

export class Validator {

    static validate (
        space: ColorSpaceID,
        input: ColorInput
    ) : ColorObject | undefined {

        try {

            const { validator: handler } = colorSpace.get( space ) as ColorSpaceFactory;

            if ( handler && typeof handler === 'function' ) {

                return handler( input );

            }

        } catch ( err ) {

            ErrorHandler.throw( {
                err, method: 'Validator',
                msg: `Validation failed for color space <${space}> with input <${
                    JSON.stringify( input )
                }>`
            } );

        }

    }

    static try (
        space: ColorSpaceID,
        input: ColorInput
    ) : boolean {

        try {

            this.validate( space, input );

        } catch {

            return false;

        }

        return true;

    }

}