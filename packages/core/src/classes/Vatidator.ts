'use strict';

import type { ColorSpaceID, ColorInstance, ColorObjectFactory } from '@pyxe/types';
import { Utils } from '@pyxe/utils';
import { colorSpaceRegistry } from './ColorSpaceRegistry.js';
import { ColorSpace } from './ColorSpace.js';

export class Validator {

    public static instanceOf (
        space: ColorSpaceID,
        value: ColorInstance
    ) : boolean {

        if ( ColorSpace.check( space ) ) {

            try {

                const { validator: handler } = colorSpaceRegistry.get( space )!;

                return handler( { space, value } );

            } catch ( err ) {

                throw new Utils.Services.error( {
                    err, method: 'Validator',
                    msg: `No validator defined for color space <${space}>`
                } );

            }

        }

        return false;

    }

    public static validate (
        input: ColorObjectFactory,
        safe: boolean = true
    ) : boolean {

        if ( this.instanceOf( input.space, input.value ) ) {

            return true;

        } else if ( safe ) {

            throw new Utils.Services.error( {
                method: 'Validator',
                msg: `Validation failed for color space <${input.space}> with input <${
                    JSON.stringify( input )
                }>`
            } );

        }

        return false;

    }

}