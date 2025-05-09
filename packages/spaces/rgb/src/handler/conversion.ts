'use strict';

import type { RGB, ColorObjectFactory, ConversionFactory } from '@pyxe/types';
import { minMaxDelta, computeHue } from './helper.js';

export const conversions: ConversionFactory = {

    lrgb: (
        input: ColorObjectFactory | undefined
    ) : ColorObjectFactory | undefined => {

        if ( input && input.space === 'rgb' ) {

            const { r, g, b } = input.value as RGB;

            const adjust = ( v: number ) : number =>
                v <= 0.04045 ? v / 12.92 : ( ( v + 0.055 ) / 1.055 ) ** 2.4;

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

    },

    hsl: (
        input: ColorObjectFactory | undefined
    ) : ColorObjectFactory | undefined => {

        if ( input && input.space === 'rgb' ) {

            const { r, g, b } = input.value as RGB;
            const { min, max, delta } = minMaxDelta( r, g, b );

            const l = ( max + min ) / 2;
            const s = delta !== 0 ? delta / ( l < 0.5 ? max + min : 2 - max - min ) : 0;

            return {
                space: 'hsl',
                value: { h: computeHue( r, g, b, max, delta ), s, l },
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

            return {
                space: 'hsv',
                value: {
                    h: computeHue( r, g, b, max, delta ),
                    s: delta !== 0 ? delta / max : 0,
                    v: max
                },
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

    hcg: (
        input: ColorObjectFactory | undefined
    ) : ColorObjectFactory | undefined => {

        if ( input && input.space === 'rgb' ) {

            const { r, g, b } = input.value as RGB;
            const { min, max, delta } = minMaxDelta( r, g, b );

            return {
                space: 'hcg',
                value: {
                    h: computeHue( r, g, b, max, delta ),
                    c: delta,
                    g: delta < 1 ? min / ( 1 - delta ) : 0
                },
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
    ) : ColorObjectFactory | undefined => {

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

    },

    yuv: (
        input: ColorObjectFactory | undefined
    ) : ColorObjectFactory | undefined => {

        if ( input && input.space === 'rgb' ) {

            const { r, g, b } = input.value as RGB;

            const y = 0.299 * r + 0.587 * g + 0.114 * b;
            const u = 0.564334 * b - 0.564334 * y + 0.5;
            const v = 0.713267 * r - 0.713267 * y + 0.5;

            return {
                space: 'yuv',
                value: { y, u, v },
                alpha: input.alpha,
                meta: input.meta ?? {}
            } as ColorObjectFactory;

        }

    },

    ycbcr: (
        input: ColorObjectFactory | undefined
    ) : ColorObjectFactory | undefined => {

        if ( input && input.space === 'rgb' ) {

            const { r, g, b } = input.value as RGB;

            const y  =  0.299 * r + 0.587 * g + 0.114 * b;
            const cb = ( b - y ) / 1.772 + 0.5;
            const cr = ( r - y ) / 1.402 + 0.5;

            return {
                space: 'ycbcr',
                value: { y, cb, cr },
                alpha: input.alpha,
                meta: input.meta ?? {}
            } as ColorObjectFactory;

        }

    },

    ydbdr: (
        input: ColorObjectFactory | undefined
    ) : ColorObjectFactory | undefined => {

        if ( input && input.space === 'rgb' ) {

            const { r, g, b } = input.value as RGB;

            const y  = 0.299 * r + 0.587 * g + 0.114 * b;
            const db = ( b - y ) * 1.333 + 0.5;
            const dr = ( r - y ) * 1.333 + 0.5;

            return {
                space: 'ydbdr',
                value: { y, db, dr },
                alpha: input.alpha,
                meta: input.meta ?? {}
            } as ColorObjectFactory;

        }

    },

    yiq: (
        input: ColorObjectFactory | undefined
    ) : ColorObjectFactory | undefined => {

        if (input && input.space === 'rgb') {

            const { r, g, b } = input.value as RGB;

            return {
                space: 'yiq',
                value: {
                    y: 0.299 * r + 0.587 * g + 0.114 * b,
                    i: ( 0.596 * r - 0.274 * g - 0.322 * b ) * 0.5 + 0.5,
                    q: ( 0.211 * r - 0.523 * g + 0.312 * b ) * 0.5 + 0.5
                },
                alpha: input.alpha,
                meta: input.meta ?? {}
            } as ColorObjectFactory;

        }

    },

    ypbpr: (
        input: ColorObjectFactory | undefined
    ) : ColorObjectFactory | undefined => {

        if ( input && input.space === 'rgb' ) {

            const { r, g, b } = input.value as RGB;

            return {
                space: 'ypbpr',
                value: {
                    y: 0.299 * r + 0.587 * g + 0.114 * b,
                    pb: ( -0.168736 * r - 0.331264 * g + 0.5 * b ) * 0.5 + 0.5,
                    pr: ( 0.5 * r - 0.418688 * g - 0.081312 * b ) * 0.5 + 0.5
                },
                alpha: input.alpha,
                meta: input.meta ?? {}
            } as ColorObjectFactory;

        }

    },

    yjk: (
        input: ColorObjectFactory | undefined
    ) : ColorObjectFactory | undefined => {

        if ( input && input.space === 'rgb' ) {

            const { r, g, b } = input.value as RGB;

            const y = b / 2 + r / 4 + g / 8;

            return {
                space: 'yjk',
                value: {
                    y: y,
                    j: ( r - y + 1 ) / 2,
                    k: ( g - y + 1 ) / 2
                },
                alpha: input.alpha,
                meta: input.meta ?? {}
            } as ColorObjectFactory;

        }

    }

};