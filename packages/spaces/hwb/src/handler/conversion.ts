'use strict';

import type { HWB, ColorObjectFactory, ConversionFactory } from '@pyxe/types';

export const conversions: ConversionFactory = {

    hsv: (
        input: ColorObjectFactory | undefined
    ) : ColorObjectFactory | undefined => {

        if ( input && input.space === 'hwb' ) {

            const { h, w, b } = input.value as HWB;

            const v = 1 - b;
            const s = v === 0 ? 0 : 1 - w / v;

            return {
                space: 'hsv',
                value: { h, s, v },
                alpha: input.alpha,
                meta: input.meta ?? {}
            } as ColorObjectFactory;

        }

    }

};