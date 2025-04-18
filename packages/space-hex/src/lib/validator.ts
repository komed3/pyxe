'use strict';

import { ColorObject, ValidatorHandler } from '@pyxe/types';
import { Utils } from '@pyxe/utils';
import { parser } from './parser.js';

export const validator: ValidatorHandler = (
    input: ColorObject
) => {

    const result = parser( input.value );

    if ( input.space === 'HEX' && result ) {

        return result;

    }

    throw new Utils.error( {
        method: 'HEX.validator',
        msg: `The input <${ JSON.stringify( input ) }> is not a valid ColorObject of <HEX> color space.`
    } );

}