'use strict';

import type { ColorSpaceName, ColorInput, ColorObject, ColorSpaceFactory } from '@pyxe/types';
import { colorSpace } from './colorSpace.js';

export class Validator {

    static validate (
        space: ColorSpaceName,
        input: ColorInput
    ) : ColorObject | undefined {

        try {

            const { validator: handler } = colorSpace._get( space ) as ColorSpaceFactory;

            if ( handler && typeof handler === 'function' ) {

                return handler( input );

            }

        } catch ( err ) {

            throw new Error (
                ``
            );

        }

    }

    static try (
        space: ColorSpaceName,
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