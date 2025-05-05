'use strict';

import type { RGB, ColorObjectFactory, ConversionFactory } from '@pyxe/types';
import { minMaxDelta, computeHue } from './helper.js';

export const conversions: ConversionFactory = {

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

    }

};