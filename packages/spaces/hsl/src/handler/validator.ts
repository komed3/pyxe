'use strict';

import type { HSL, ColorObjectFactory, ValidatorHandler } from '@pyxe/types';
import { Channel } from '@pyxe/utils';

export const validator: ValidatorHandler = (
    input: ColorObjectFactory
) : boolean => {

    const { h, s, l, a } = ( input.value ?? {} ) as HSL;

    return !! (
        input.space === 'HSL' &&
        Channel.validateNumeric( h, 0, 360 ) &&
        Channel.validateNumeric( s, 0, 1 ) &&
        Channel.validateNumeric( l, 0, 1 ) &&
        Channel.validateAlpha( a )
    );

}