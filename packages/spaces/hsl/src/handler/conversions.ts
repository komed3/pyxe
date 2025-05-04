'use strict';

import type { HSL, ColorObjectFactory, ConversionFactory } from '@pyxe/types';

export const conversions: ConversionFactory = {

    rgb: (
        input: ColorObjectFactory | undefined
    ) : ColorObjectFactory | undefined => {

        if ( input && input.space === 'hsl' ) {

            const { h, s, l } = input.value as HSL;

            const q = l < 0.5 ? l * ( 1 + s ) : l + s - l * s;
            const p = 2 * l - q;

            const [ r, g, b ] = [ h + 1/3, h, h - 1/3 ].map( t => {

                if ( t < 0 ) t++; else if ( t > 1 ) t--;

                return t < 1/6 ? p + ( q - p ) * 6 * t : t < 1/2 ? q
                     : t < 2/3 ? p + ( q - p ) * ( 2/3 - t ) * 6 : p;

            } );

            return {
                space: 'rgb',
                value: { r, g, b },
                alpha: input.alpha,
                meta: input.meta ?? {}
            } as ColorObjectFactory;

        }

    },

    hsv: (
        input: ColorObjectFactory | undefined
    ) : ColorObjectFactory | undefined => {

        if ( input && input.space === 'hsl' ) {

            const { h, s, l } = input.value as HSL;

            const v = l + s * Math.min( l, 1 - l );
            const sv = v === 0 ? 0 : 2 * ( 1 - ( l / v ) );

            return {
                space: 'hsv',
                value: { h, s: sv, v },
                alpha: input.alpha,
                meta: input.meta ?? {}
            } as ColorObjectFactory;

        }

    }

};