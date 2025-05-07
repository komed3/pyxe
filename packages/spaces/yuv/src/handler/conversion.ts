'use strict';

import type { YUV, ColorObjectFactory, ConversionFactory } from '@pyxe/types';

export const conversions: ConversionFactory = {

    rgb: (
        input: ColorObjectFactory | undefined
    ) : ColorObjectFactory | undefined => {

        if ( input && input.space === 'yuv' ) {

            const { y, u, v } = input.value as YUV;

            const U = 0.872 * u - 0.436;
            const V = 1.230 * v - 0.615;

            return {
                space: 'rgb',
                value: {
                    r: y + 1.140 * V,
                    g: y - 0.396 * U - 0.581 * V,
                    b: y + 2.029 * U
                },
                alpha: input.alpha,
                meta: input.meta ?? {}
            } as ColorObjectFactory;

        }

    }

};