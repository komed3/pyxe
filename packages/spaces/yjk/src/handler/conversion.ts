'use strict';

import type { YJK, ColorObjectFactory, ConversionFactory } from '@pyxe/types';

export const conversions: ConversionFactory = {

    rgb: (
        input: ColorObjectFactory | undefined
    ) : ColorObjectFactory | undefined => {

        if ( input && input.space === 'yjk' ) {

            const { y, j, k } = input.value as YJK;

            const J = j * 2 - 1;
            const K = k * 2 - 1;

            return {
                space: 'rgb',
                value: {
                    r: y + J,
                    g: y + K,
                    b: ( 5 / 4 ) * y - J / 2 - K / 4
                },
                alpha: input.alpha,
                meta: input.meta ?? {}
            } as ColorObjectFactory;

        }

    }

};