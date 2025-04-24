'use strict';

import type { RGB, ColorObjectFactory, ConversionFactory } from '@pyxe/types';
import { Channel, Transform } from '@pyxe/utils';

export const conversions: ConversionFactory = {

    HEX: (
        input: ColorObjectFactory | undefined
    ) : ColorObjectFactory | undefined => {

        if ( input && input.space === 'RGB' ) {

            const { r, g, b, a } = input.value as RGB;

            const parts = [ r, g, b ].map(
                ( c ) => Transform.dechex( Channel.clamp( c, 0, 255 ) )
            );

            return {
                space: 'HEX',
                value: `#${ parts.join( '' ) }${ Transform.dechexAlpha( a ) }`,
                meta: input.meta ?? {}
            } as ColorObjectFactory;

        }

    },

    HSL: (
        input: ColorObjectFactory | undefined
    ) : ColorObjectFactory | undefined => {

        if ( input && input.space === 'RGB' ) {

            const { r, g, b, a } = input.value as RGB;

            const [ rN, gN, bN ] = [ r, g, b ].map(
                ( c ) => Channel.normalize( c, 0, 255 )
            );

            const max = Math.max( rN, gN, bN ),
                  min = Math.min( rN, gN, bN ),
                  delta = max - min;

            let h, s, l = ( max + min ) / 2;

            if ( delta === 0 ) {

                h = s = 0;

            } else {

                h = ( max === rN
                    ? ( gN - bN ) / delta + ( gN < bN ? 6 : 0 )
                    : max === gN
                        ? ( bN - rN ) / delta + 2
                        : ( rN - gN ) / delta + 4
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