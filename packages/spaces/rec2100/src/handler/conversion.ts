'use strict';

import type { RGB, ColorObjectFactory, ConversionFactory } from '@pyxe/types';

export const conversions_pq: ConversionFactory = {

    lrgb: (
        input: ColorObjectFactory | undefined
    ) : ColorObjectFactory | undefined => {

        if ( input && input.space === 'rec2100pq' ) {

            const { r, g, b } = input.value as RGB;

            const adjust = ( v: number ) : number => {

                const vp = Math.pow( v, 1 / 78.84375 );

                return Math.pow( Math.max( (
                    ( vp - 0.8359375 ) / ( 18.8515625 - 18.6875 * vp )
                ), 0 ), 1 / 0.1593017578125 );

            };

            return {
                space: 'lrgb',
                value: {
                    r: adjust( r ),
                    g: adjust( g ),
                    b: adjust( b )
                },
                alpha: input.alpha,
                meta: input.meta ?? {}
            } as ColorObjectFactory;

        }

    }

};

export const conversions_hlg: ConversionFactory = {

    lrgb: (
        input: ColorObjectFactory | undefined
    ) : ColorObjectFactory | undefined => {

        if ( input && input.space === 'rec2100hlg' ) {

            const { r, g, b } = input.value as RGB;

            const adjust = ( v: number ) : number =>
                Math.min( 1, v <= 0.5 ? ( v * v ) / 3 : (
                    Math.exp( ( v - 0.55991073 ) / 0.17883277 ) + 0.28466892
                ) / 12 );

            return {
                space: 'lrgb',
                value: {
                    r: adjust( r ),
                    g: adjust( g ),
                    b: adjust( b )
                },
                alpha: input.alpha,
                meta: input.meta ?? {}
            } as ColorObjectFactory;

        }

    }

};