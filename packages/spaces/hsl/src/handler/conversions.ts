'use strict';

import type { HSL, ColorObjectFactory, ConversionFactory } from '@pyxe/types';

export const conversions: ConversionFactory = {

    RGB: (
        input: ColorObjectFactory | undefined
    ) : ColorObjectFactory | undefined => {

        if ( input && input.space === 'HSL' ) {

            const { h, s, l, a } = input.value as HSL;

            const c = ( 1 - Math.abs( 2 * l - 1 ) ) * s;
            const x = c * ( 1 - Math.abs( ( h / 60 ) % 2 - 1 ) );
            const m = l - c / 2;

            let r, g, b;

            if ( h < 60 )       [ r, g, b ] = [ c, x, 0 ];
            else if ( h < 120 ) [ r, g, b ] = [ x, c, 0 ];
            else if ( h < 180 ) [ r, g, b ] = [ 0, c, x ];
            else if ( h < 240 ) [ r, g, b ] = [ 0, x, c ];
            else if ( h < 300 ) [ r, g, b ] = [ x, 0, c ];
            else                [ r, g, b ] = [ c, 0, x ];

            return {
                space: 'RGB',
                value: {
                    r: ( r + m ) * 255, g: ( g + m ) * 255, b: ( b + m ) * 255,
                    ...( a !== undefined ? { a } : {} )
                },
                meta: input.meta ?? {}
            } as ColorObjectFactory;

        }

    }

};