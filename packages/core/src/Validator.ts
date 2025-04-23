'use strict';

import type { ColorSpaceName, ColorInstance, ColorObjectFactory } from '@pyxe/types';
import { colorSpaceRegistry } from './registry/ColorSpaceRegistry.js';
import { ColorSpace } from './ColorSpace.js';
import { PyxeError } from './services/PyxeError.js';

export class Validator {

    public static instanceOf (
        space: ColorSpaceName,
        value: ColorInstance
    ) : boolean {

        if ( ColorSpace.check( space ) ) {

            try {

                const { validator: handler } = colorSpaceRegistry.get( space )!;

                return handler( { space, value } );

            } catch ( err ) {

                throw new PyxeError ( {
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

            throw new PyxeError ( {
                method: 'Validator',
                msg: `Validation failed for color space <${input.space}> with input <${
                    JSON.stringify( input )
                }>`
            } );

        }

        return false;

    }

}