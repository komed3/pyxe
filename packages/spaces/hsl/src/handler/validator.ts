'use strict';

import type { HSL, ColorObjectFactory, ValidatorHandler } from '@pyxe/types';

export const validator: ValidatorHandler = (
    input: ColorObjectFactory
) : boolean => {

    const { h, s, l, a } = ( input.value ?? {} ) as HSL;

    return !! (
        input.space === 'HSL' && (
            Number.isFinite( h ) && h >= 0 && h <= 360 &&
            Number.isFinite( s ) && s >= 0 && s <= 1 &&
            Number.isFinite( l ) && l >= 0 && l <= 1 &&
            ( a === undefined || (
                typeof a === 'number' && a >= 0 && a <= 1
            ) )
        )
    );

}