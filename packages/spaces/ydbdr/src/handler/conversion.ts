'use strict';

import type { YDbDr, ColorObjectFactory, ConversionFactory } from '@pyxe/types';

export const conversions: ConversionFactory = {

    rgb: (
        input: ColorObjectFactory | undefined
    ) : ColorObjectFactory | undefined => {

        if ( input && input.space === 'ydbdr' ) {

            const { y, db, dr } = input.value as YDbDr;

            const r = y + ( dr - 0.5 ) / 1.333;
            const b = y + ( db - 0.5 ) / 1.333;
            const g = ( y - 0.299 * r - 0.114 * b ) / 0.587;

            return {
                space: 'rgb',
                value: { r, g, b },
                alpha: input.alpha,
                meta: input.meta ?? {}
            } as ColorObjectFactory;

        }

    }

};