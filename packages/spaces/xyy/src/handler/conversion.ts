'use strict';

import type { xyY, ColorObjectFactory, ConversionFactory } from '@pyxe/types';

export const conversions: ConversionFactory = {

    xyz: (
        input: ColorObjectFactory | undefined
    ) : ColorObjectFactory | undefined => {

        if ( input && input.space === 'xyy' ) {

            const { x, y, Y } = input.value as xyY;

            return {
                space: 'xyz',
                value: {
                    x: y > 0 ? ( x * Y ) / y : 0,
                    y: Y,
                    z: y > 0 ? ( ( 1 - x - y ) * Y ) / y : 0
                },
                alpha: input.alpha,
                meta: input.meta ?? {}
            } as ColorObjectFactory;

        }

    }

};