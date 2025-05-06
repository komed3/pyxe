'use strict';

import type { HSI, ColorObjectFactory, ConversionFactory } from '@pyxe/types';

export const conversions: ConversionFactory = {

    rgb: (
        input: ColorObjectFactory | undefined
    ) : ColorObjectFactory | undefined => {

        if ( input && input.space === 'hsi' ) {

            const { h, s, i } = input.value as HSI;
            const H = h * 2 * Math.PI;

            const adjust = ( v: number ) => i * (
                1 + s * Math.cos( H - v * 2 * Math.PI / 3 ) /
                Math.cos( Math.PI / 3 - ( H - v * 2 * Math.PI / 3 ) )
            );

            const [ r, g, b ] = s === 0 ? [ i, i, i ]
                : H < 2 * Math.PI / 3 ? [ adjust( 0 ), 3 * i - adjust( 0 ) - i * ( 1 - s ), i * ( 1 - s ) ]
                : H < 4 * Math.PI / 3 ? [ i * ( 1 - s ), adjust( 1 ), 3 * i - adjust( 1 ) - i * ( 1 - s ) ]
                : [ 3 * i - adjust( 2 ) - i * ( 1 - s ), i * ( 1 - s ), adjust( 2 ) ];

            return {
                space: 'rgb',
                value: { r, g, b },
                alpha: input.alpha,
                meta: input.meta ?? {}
            } as ColorObjectFactory;

        }

    }

};