'use strict';

import { RGB, ColorObjectFactory, ValidatorHandler } from '@pyxe/types';

export const validator: ValidatorHandler = (
    input: ColorObjectFactory
) : boolean => {

    const { r, g, b, a } = ( input.value ?? {} ) as RGB;

    return !! (
        input.space === 'RGB' && (
            Number.isFinite( r ) && r >= 0 && r <= 255 &&
            Number.isFinite( g ) && g >= 0 && g <= 255 &&
            Number.isFinite( b ) && b >= 0 && b <= 255 &&
            ( a === undefined || (
                typeof a === 'number' && a >= 0 && a <= 1
            ) )
        )
    );

}