'use strict';

import type { YPbPr, ColorObjectFactory, ConversionFactory } from '@pyxe/types';

export const conversions: ConversionFactory = {

    rgb: (
        input: ColorObjectFactory | undefined
    ) : ColorObjectFactory | undefined => {

        if ( input && input.space === 'ypbpr' ) {

            const { y, pb, pr } = input.value as YPbPr;

            const Pb = ( pb - 0.5 ) * 2;
            const Pr = ( pr - 0.5 ) * 2;

            return {
                space: 'rgb',
                value: {
                    r: y + 1.402 * Pr,
                    g: y - 0.344136 * Pb - 0.714136 * Pr,
                    b: y + 1.772 * Pb
                },
                alpha: input.alpha,
                meta: input.meta ?? {}
            } as ColorObjectFactory;

        }

    }    

};