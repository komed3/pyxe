'use strict';

import type { HSV, ColorObjectFactory, ValidatorHandler } from '@pyxe/types';
import { Channel } from '@pyxe/utils';

export const validator: ValidatorHandler = (
    input: ColorObjectFactory
) : boolean => {

    const { h, s, v, a } = ( input.value ?? {} ) as HSV;

    return !! (
        input.space === 'HSV' &&
        Channel.validateNumeric( h, 0, 360 ) &&
        Channel.validateNumeric( s, 0, 1 ) &&
        Channel.validateNumeric( v, 0, 1 ) &&
        Channel.validateAlpha( a )
    );

}