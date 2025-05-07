'use strict';

import type { CMYK, ColorObjectFactory, ConversionFactory } from '@pyxe/types';

export const conversions: ConversionFactory = {

    cmy: (
        input: ColorObjectFactory | undefined
    ) : ColorObjectFactory | undefined => {

        if ( input && input.space === 'cmyk' ) {

            const { c, m, y, k } = input.value as CMYK;

            return {
                space: 'cmy',
                value: {
                    c: ( c * ( 1 - k ) + k ),
                    m: ( m * ( 1 - k ) + k ),
                    y: ( y * ( 1 - k ) + k )
                },
                alpha: input.alpha,
                meta: input.meta ?? {}
            } as ColorObjectFactory;

        }

    }

};