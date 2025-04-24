'use strict';

import type { RGB, ColorObjectFactory, ConversionFactory } from '@pyxe/types';
import { Numeral } from '@pyxe/utils';

export const conversions: ConversionFactory = {

    HEX: (
        input: ColorObjectFactory | undefined
    ) : ColorObjectFactory | undefined => {

        if ( input && input.space === 'RGB' ) {

            const { r, g, b, a } = input.value as RGB;

            const parts = [ r, g, b ].map(
                ( c ) => Numeral.dechex( c )
            );

            return {
                space: 'HEX',
                value: `#${ parts.join( '' ) }${ Numeral.dechexAlpha( a ) }`,
                meta: input.meta ?? {}
            } as ColorObjectFactory;

        }

    },

    HSL: (
        input: ColorObjectFactory | undefined
    ) : ColorObjectFactory | undefined => {

        if ( input && input.space === 'RGB' ) {

            const { r, g, b, a } = input.value as RGB;

            const max = Math.max( r, g, b ),
                  min = Math.min( r, g, b ),
                  delta = max - min;

            let h, s, l = ( max + min ) / 2 / 255;

            if ( delta === 0 ) {

                h = s = 0;

            } else {

                h = ( max === r
                    ? ( g - b ) / delta + ( g < b ? 6 : 0 )
                    : max === g
                        ? ( b - r ) / delta + 2
                        : ( r - g ) / delta + 4
                ) * 60;

                s = l < 0.5
                    ? delta / ( max + min )
                    : delta / ( 510 - max - min );

            }

            return {
                space: 'HSL',
                value: { h, s, l, ...(
                    a !== undefined ? { a } : {}
                ) },
                meta: input.meta ?? {}
            } as ColorObjectFactory;

        }

    }

};