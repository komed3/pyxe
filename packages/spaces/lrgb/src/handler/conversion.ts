'use strict';

import type { RGB, ColorObjectFactory, ConversionFactory } from '@pyxe/types';

export const conversions: ConversionFactory = {

    rgb: (
        input: ColorObjectFactory | undefined
    ) : ColorObjectFactory | undefined => {

        if ( input && input.space === 'lrgb' ) {

            const { r, g, b } = input.value as RGB;

            const adjust = ( v: number ) : number =>
                v <= 0.0031308 ? 12.92 * v : 1.055 * v ** ( 1 / 2.4 ) - 0.055;

            return {
                space: 'rgb',
                value: {
                    r: adjust( r ),
                    g: adjust( g ),
                    b: adjust( b )
                },
                alpha: input.alpha,
                meta: input.meta ?? {}
            } as ColorObjectFactory;

        }

    },

    rec709: (
        input: ColorObjectFactory | undefined
    ) : ColorObjectFactory | undefined => {

        if ( input && input.space === 'lrgb' ) {

            const { r, g, b } = input.value as RGB;

            const adjust = ( v: number ) : number =>
                v < 0.018 ? 4.5 * v : 1.099 * ( v ** 0.45 ) - 0.099;

            return {
                space: 'rec709',
                value: {
                    r: adjust( r ),
                    g: adjust( g ),
                    b: adjust( b )
                },
                alpha: input.alpha,
                meta: input.meta ?? {}
            } as ColorObjectFactory;

        }

    },

    rec2020: (
        input: ColorObjectFactory | undefined
    ) : ColorObjectFactory | undefined => {

        if ( input && input.space === 'lrgb' ) {

            const { r, g, b } = input.value as RGB;

            const adjust = ( v: number ) : number =>
                v < 0.0181 ? 4.5 * v : 1.0993 * ( v ** 0.45 ) - 0.0993;

            return {
                space: 'rec2020',
                value: {
                    r: adjust( r ),
                    g: adjust( g ),
                    b: adjust( b )
                },
                alpha: input.alpha,
                meta: input.meta ?? {}
            } as ColorObjectFactory;

        }

    },

    xyz: (
        input: ColorObjectFactory | undefined
    ) : ColorObjectFactory | undefined => {

        if ( input && input.space === 'lrgb' ) {

            const { r, g, b } = input.value as RGB;

            return {
                space: 'xyz',
                value: {
                    x: ( r * 0.4124564 + g * 0.3575761 + b * 0.1804375 ) / 0.9504700,
                    y: ( r * 0.2126729 + g * 0.7151522 + b * 0.0721750 ) / 1.0000001,
                    z: ( r * 0.0193339 + g * 0.1191920 + b * 0.9503041 ) / 1.0888300
                },
                alpha: input.alpha,
                meta: input.meta ?? {}
            } as ColorObjectFactory;

        }

    }

};