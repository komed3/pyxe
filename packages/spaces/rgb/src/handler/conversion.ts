'use strict';

import type { RGB, ColorObjectFactory, ConversionFactory } from '@pyxe/types';
import { minMaxDelta, computeHue } from './helper.js';

export const conversions: ConversionFactory = {

    lrgb: (
        input: ColorObjectFactory | undefined
    ) : ColorObjectFactory | undefined => {

        if ( input && input.space === 'rgb' ) {

            const { r, g, b } = input.value as RGB;

            const gamma = ( v: number ) : number =>
                v <= 0.04045 ? v / 12.92 : ( ( v + 0.055 ) / 1.055 ) ** 2.4;

            return {
                space: 'lrgb',
                value: {
                    r: gamma( r ),
                    g: gamma( g ),
                    b: gamma( b )
                },
                alpha: input.alpha,
                meta: input.meta ?? {}
            } as ColorObjectFactory;

        }

    },

    hsl: (
        input: ColorObjectFactory | undefined
    ) : ColorObjectFactory | undefined => {

        if ( input && input.space === 'rgb' ) {

            const { r, g, b } = input.value as RGB;
            const { min, max, delta } = minMaxDelta( r, g, b );

            const l = ( max + min ) / 2;
            let h = 0, s = 0;

            if ( delta !== 0 ) {

                h = computeHue( r, g, b, max, delta );

                s = delta / ( l < 0.5 ? max + min : 2 - max - min );

            }

            return {
                space: 'hsl',
                value: { h, s, l },
                alpha: input.alpha,
                meta: input.meta ?? {}
            } as ColorObjectFactory;

        }

    },

    hsv: (
        input: ColorObjectFactory | undefined
    ) : ColorObjectFactory | undefined => {

        if ( input && input.space === 'rgb' ) {

            const { r, g, b } = input.value as RGB;
            const { max, delta } = minMaxDelta( r, g, b );

            const v = max;
            let h = 0, s = 0;

            if ( delta !== 0 ) {

                h = computeHue( r, g, b, max, delta );

                s = delta / max;

            }

            return {
                space: 'hsv',
                value: { h, s, v },
                alpha: input.alpha,
                meta: input.meta ?? {}
            } as ColorObjectFactory;

        }

    },

    hsi: (
        input: ColorObjectFactory | undefined
    ) : ColorObjectFactory | undefined => {

        if ( input && input.space === 'rgb' ) {

            const { r, g, b } = input.value as RGB;
            const { min } = minMaxDelta( r, g, b );

            const i = ( r + g + b ) / 3;
            const s = i > 0 ? ( 1 - min / i ) : 0;

            const h = s > 0 ? Math.acos(
                0.5 * ( ( r - g ) + ( r - b ) ) / (
                    Math.sqrt( ( r - g ) ** 2 + ( r - b ) * ( g - b ) ) + 1e-10
                )
            ) / ( 2 * Math.PI ) : 0;

            return {
                space: 'hsi',
                value: { h: b > g ? 1 - h : h, s, i },
                alpha: input.alpha,
                meta: input.meta ?? {}
            } as ColorObjectFactory;

        }

    },

    cmy: (
        input: ColorObjectFactory | undefined
    ) : ColorObjectFactory | undefined => {

        if ( input && input.space === 'rgb' ) {

            const { r, g, b } = input.value as RGB;

            return {
                space: 'cmy',
                value: { c: 1 - r, m: 1 - g, y: 1 - b },
                alpha: input.alpha,
                meta: input.meta ?? {}
            } as ColorObjectFactory;

        }

    },

    cmyk: (
        input: ColorObjectFactory | undefined
    ): ColorObjectFactory | undefined => {

        if ( input && input.space === 'rgb' ) {

            const { r, g, b } = input.value as RGB;

            const k = 1 - Math.max( r, g, b );

            return {
                space: 'cmyk',
                value: {
                    c: k === 1 ? 0 : ( 1 - r - k ) / ( 1 - k ),
                    m: k === 1 ? 0 : ( 1 - g - k ) / ( 1 - k ),
                    y: k === 1 ? 0 : ( 1 - b - k ) / ( 1 - k ),
                    k
                },
                alpha: input.alpha,
                meta: input.meta ?? {}
            } as ColorObjectFactory;

        }

    }

};