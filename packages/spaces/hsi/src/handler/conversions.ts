'use strict';

import type { HSI, ColorObjectFactory, ConversionFactory } from '@pyxe/types';

export const conversions: ConversionFactory = {

    rgb: (
        input: ColorObjectFactory | undefined
    ) : ColorObjectFactory | undefined => {

        if ( input && input.space === 'hsi' ) {

            const { h, s, i } = input.value as HSI;

            const H = h * 2 * Math.PI;

            const [ r, g, b ] = ( () => {

                const adjust = ( v: number ) => i * (
                    1 + s * Math.cos( H - v * 2 * Math.PI / 3 ) /
                    Math.cos( Math.PI / 3 - ( H - v * 2 * Math.PI / 3 ) )
                );

                if ( s === 0 ) {

                    return [ i, i, i ];

                } else if ( H < 2 * Math.PI / 3 ) {

                    return [
                        adjust( 0 ),
                        3 * i - adjust( 0 ) - i * ( 1 - s ),
                        i * ( 1 - s )
                    ];

                } else if ( H < 4 * Math.PI / 3 ) {

                    return [
                        i * ( 1 - s ),
                        adjust( 1 ),
                        3 * i - adjust( 1 ) - i * ( 1 - s )
                    ];

                }

                return [
                    3 * i - adjust( 2 ) - i * ( 1 - s ),
                    i * ( 1 - s ),
                    adjust( 2 )
                ];

            } )();

            return {
                space: 'rgb',
                value: { r, g, b },
                alpha: input.alpha,
                meta: input.meta ?? {}
            } as ColorObjectFactory;

        }

    }

};