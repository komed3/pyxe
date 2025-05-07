'use strict';

import type { HSV, ColorObjectFactory, ConversionFactory } from '@pyxe/types';

export const conversions: ConversionFactory = {

    rgb: (
        input: ColorObjectFactory | undefined
    ) : ColorObjectFactory | undefined => {

        if ( input && input.space === 'hsv' ) {

            const { h, s, v } = input.value as HSV;

            const i = Math.floor( h * 6 ) % 6;
            const f = h * 6 - i;
            const p = v * ( 1 - s );
            const q = v * ( 1 - s * f );
            const t = v * ( 1 - s * ( 1 - f ) );

            const [ r, g, b ] = ( () => {

                switch ( i ) {

                    case  0: return [ v, t, p ];
                    case  1: return [ q, v, p ];
                    case  2: return [ p, v, t ];
                    case  3: return [ p, q, v ];
                    case  4: return [ t, p, v ];
                    case  5: return [ v, p, q ];

                    default: return [ v, p, p ];

                }

            } )();

            return {
                space: 'rgb',
                value: { r, g, b },
                alpha: input.alpha,
                meta: input.meta ?? {}
            } as ColorObjectFactory;

        }

    },

    hsl: (
        input: ColorObjectFactory | undefined
    ) : ColorObjectFactory | undefined => {

        if ( input && input.space === 'hsv' ) {

            const { h, s, v } = input.value as HSV;

            const l = v * ( 1 - ( s / 2 ) );
            const sl = l === 0 || l === 1 ? 0 : ( v - l ) / Math.min( l, 1 - l );

            return {
                space: 'hsl',
                value: { h, s: sl, l },
                alpha: input.alpha,
                meta: input.meta ?? {}
            } as ColorObjectFactory;

        }

    },

    hwb: (
        input: ColorObjectFactory | undefined
    ) : ColorObjectFactory | undefined => {

        if ( input && input.space === 'hsv' ) {

            const { h, s, v } = input.value as HSV;

            return {
                space: 'hwb',
                value: { h, w: ( 1 - s ) * v, b: 1 - v },
                alpha: input.alpha,
                meta: input.meta ?? {}
            } as ColorObjectFactory;

        }

    }

};