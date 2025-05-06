'use strict';

import type { XYZ, ColorObjectFactory, ConversionFactory } from '@pyxe/types';

export const conversions: ConversionFactory = {

    lrgb: (
        input: ColorObjectFactory | undefined
    ) : ColorObjectFactory | undefined => {

        if ( input && input.space === 'xyz' ) {

            const { x, y, z } = input.value as XYZ;

            const X = x * 0.9504700;
            const Y = y * 1.0000001;
            const Z = z * 1.0888300;

            return {
                space: 'lrgb',
                value: {
                    r: X *  3.2404542 + Y * -1.5371385 + Z * -0.4985314,
                    g: X * -0.9692660 + Y *  1.8760108 + Z *  0.0415560,
                    b: X *  0.0556434 + Y * -0.2040259 + Z *  1.0572252
                },
                alpha: input.alpha,
                meta: input.meta ?? {}
            } as ColorObjectFactory;

        }

    },

    lab: (
        input: ColorObjectFactory | undefined
    ) : ColorObjectFactory | undefined => {

        if ( input && input.space === 'xyz' ) {

            const { x, y, z } = input.value as XYZ;

            const adjust = ( v: number ) : number =>
                v > 0.008856 ? Math.cbrt( v ) : ( 7.787 * v ) + ( 16 / 116 );

            const Y = adjust( y );

            return {
                space: 'lab',
                value: {
                    l: ( 116 * Y - 16 ) / 100,
                    a: ( 500 * ( adjust( x ) - Y ) + 128 ) / 255,
                    b: ( 200 * ( Y - adjust( z ) ) + 128 ) / 255
                },
                alpha: input.alpha,
                meta: input.meta ?? {}
            } as ColorObjectFactory;

        }

    },

    xyy: (
        input: ColorObjectFactory | undefined
    ) : ColorObjectFactory | undefined => {

        if ( input && input.space === 'xyz' ) {

            const { x, y, z } = input.value as XYZ;
            const sum = x + y + z;

            return {
                space: 'xyy',
                value: {
                    x: sum > 0 ? x / sum : 0,
                    y: sum > 0 ? y / sum : 0,
                    Y: y
                },
                alpha: input.alpha,
                meta: input.meta ?? {}
            } as ColorObjectFactory;

        }

    }

};