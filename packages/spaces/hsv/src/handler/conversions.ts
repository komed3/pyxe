'use strict';

import type { HSV, ColorObjectFactory, ConversionFactory } from '@pyxe/types';
import { Channel } from '@pyxe/utils';

export const conversions: ConversionFactory = {

    RGB: (
        input: ColorObjectFactory | undefined
    ) : ColorObjectFactory | undefined => {

        if ( input && input.space === 'HSV' ) {

            const { h, s, v, a } = input.value as HSV;

            const hh = ( ( h % 360 ) + 360 ) % 360 / 60;
            const i = Math.floor( hh );
            const f = hh - i;
            const p = v * ( 1 - s );
            const q = v * ( 1 - s * f );
            const t = v * ( 1 - s * ( 1 - f ) );

            const [ r, g, b ] = ( () => {

                switch ( i ) {

                    case 0: return  [ v, t, p ];
                    case 1: return  [ q, v, p ];
                    case 2: return  [ p, v, t ];
                    case 3: return  [ p, q, v ];
                    case 4: return  [ t, p, v ];
                    case 5: return  [ v, p, q ];

                    default: return [ v, p, p ];

                }

            } )().map( c => c * 255 );

            return {
                space: 'RGB',
                value: { r, g, b, ...Channel.safeAlpha( a ) },
                meta: input.meta ?? {}
            } as ColorObjectFactory;

        }

    },

    HSL: (
        input: ColorObjectFactory | undefined
    ) : ColorObjectFactory | undefined => {

        if ( input && input.space === 'HSV' ) {

            const { h, s, v, a } = input.value as HSV;

            const l = v * ( 1 - s / 2 );
            const sl = l === 0 || l === 1 ? 0 : ( v - l ) / Math.min( l, 1 - l );

            return {
                space: 'HSL',
                value: { h, s: sl, l, ...Channel.safeAlpha( a ) },
                meta: input.meta ?? {}
            } as ColorObjectFactory;

        }

    }

};