'use strict';

import type { YIQ, ColorObjectFactory, ConversionFactory } from '@pyxe/types';

export const conversions: ConversionFactory = {

    rgb: (
        input: ColorObjectFactory | undefined
    ) : ColorObjectFactory | undefined => {

        if ( input && input.space === 'yiq' ) {

            const { y, i, q } = input.value as YIQ;

            const I = ( i - 0.5 ) * 2;
            const Q = ( q - 0.5 ) * 2;

            return {
                space: 'rgb',
                value: {
                    r: y + 0.956 * I + 0.621 * Q,
                    g: y - 0.272 * I - 0.647 * Q,
                    b: y - 1.106 * I + 1.703 * Q
                },
                alpha: input.alpha,
                meta: input.meta ?? {}
            } as ColorObjectFactory;

        }

    }

};