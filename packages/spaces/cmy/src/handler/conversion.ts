'use strict';

import type { CMY, ColorObjectFactory, ConversionFactory } from '@pyxe/types';

export const conversions: ConversionFactory = {

    rgb: (
        input: ColorObjectFactory | undefined
    ) : ColorObjectFactory | undefined => {

        if ( input && input.space === 'cmy' ) {

            const { c, m, y } = input.value as CMY;

            return {
                space: 'rgb',
                value: { r: 1 - c, g: 1 - m, b: 1 - y },
                alpha: input.alpha,
                meta: input.meta ?? {}
            } as ColorObjectFactory;

        }

    },

    cmyk: (
        input: ColorObjectFactory | undefined
    ) : ColorObjectFactory | undefined => {

        if ( input && input.space === 'cmy' ) {

            const { c, m, y } = input.value as CMY;

            const k = Math.min( c, m, y );

            return {
                space: 'cmyk',
                value: {
                    c: k === 1 ? 0 : ( c - k ) / ( 1 - k ),
                    m: k === 1 ? 0 : ( m - k ) / ( 1 - k ),
                    y: k === 1 ? 0 : ( y - k ) / ( 1 - k ),
                    k
                },
                alpha: input.alpha,
                meta: input.meta ?? {}
            } as ColorObjectFactory;

        }

    }

};