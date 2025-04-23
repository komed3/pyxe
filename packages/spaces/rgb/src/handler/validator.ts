'use strict';

import type { RGB, ColorObjectFactory, ValidatorHandler } from '@pyxe/types';
import { Channel } from '@pyxe/utils';

export const validator: ValidatorHandler = (
    input: ColorObjectFactory
) : boolean => {

    const { r, g, b, a } = ( input.value ?? {} ) as RGB;

    return !! (
        input.space === 'RGB' &&
        Channel.validateNumeric( r, 0, 255 ) &&
        Channel.validateNumeric( g, 0, 255 ) &&
        Channel.validateNumeric( b, 0, 255 ) &&
        Channel.validateAlpha( a )
    );

}