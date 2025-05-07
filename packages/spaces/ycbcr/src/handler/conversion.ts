'use strict';

import type { YCbCr, ColorObjectFactory, ConversionFactory } from '@pyxe/types';

export const conversions: ConversionFactory = {

    rgb: (
        input: ColorObjectFactory | undefined
    ) : ColorObjectFactory | undefined => {

        if (input && input.space === 'ycbcr' ) {

            const { y, cb, cr } = input.value as YCbCr;

            const cB = cb - 0.5;
            const cR = cr - 0.5;

            return {
                space: 'rgb',
                value: {
                    r: y + 1.402 * cR,
                    g: y - 0.344136 * cB - 0.714136 * cR,
                    b: y + 1.772 * cB
                },
                alpha: input.alpha,
                meta: input.meta ?? {}
            } as ColorObjectFactory;

        }

    }

};