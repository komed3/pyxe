'use strict';

import type { Lab, ColorObjectFactory, ConversionFactory } from '@pyxe/types';

export const conversions: ConversionFactory = {

    xyz: (
        input: ColorObjectFactory | undefined
    ) : ColorObjectFactory | undefined => {

        if ( input && input.space === 'lab' ) {

            const { l, a, b } = input.value as Lab;

            const adjust = ( v: number ) : number =>
                v ** 3 > 0.008856 ? v ** 3 : ( v - 16 / 116 ) / 7.787;

            const L = ( l * 100 + 16 ) / 116;

            return {
                space: 'xyz',
                value: {
                    x: adjust( ( a * 255 - 128 ) / 500 + L ),
                    y: adjust( L ),
                    z: adjust( L - ( b * 255 - 128 ) / 200 )
                },
                alpha: input.alpha,
                meta: input.meta ?? {}
            } as ColorObjectFactory;

        }

    }

};