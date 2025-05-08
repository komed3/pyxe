'use strict';

import type { RGB, ColorObjectFactory, ConversionFactory } from '@pyxe/types';

export const conversions: ConversionFactory = {

    lrgb: (
        input: ColorObjectFactory | undefined
    ) : ColorObjectFactory | undefined => {

        if ( input && input.space === 'rec2020' ) {

            const { r, g, b } = input.value as RGB;

            const adjust = ( v: number ) : number =>
                v < 0.08145 ? v / 4.5 : ( ( v + 0.0993 ) / 1.0993 ) ** ( 1 / 0.45 );

            return {
                space: 'lrgb',
                value: {
                    r: adjust( r ),
                    g: adjust( g ),
                    b: adjust( b )
                },
                alpha: input.alpha,
                meta: input.meta ?? {}
            } as ColorObjectFactory;

        }

    }

};