'use strict';

import type { HCG, ColorObjectFactory, ConversionFactory } from '@pyxe/types';

export const conversions: ConversionFactory = {

    rgb: (
        input: ColorObjectFactory | undefined
    ) : ColorObjectFactory | undefined => {

        if ( input && input.space === 'hcg' ) {

            const { h, c, g: gray } = input.value as HCG;
    
            const hi = Math.floor( h * 6 );
            const t = h * 6 - hi;
            const q = 1 - t;

            const [ r, g, b ] = ( () => {

                switch ( hi % 6 ) {

                    default:
                    case  0: return [ 1, t, 0 ];
                    case  1: return [ q, 1, 0 ];
                    case  2: return [ 0, 1, t ];
                    case  3: return [ 0, q, 1 ];
                    case  4: return [ t, 0, 1 ];
                    case  5: return [ 1, 0, q ];

                }

            } )().map( v => gray + c * ( v - gray ) );
    
            return {
                space: 'rgb',
                value: { r, g, b },
                alpha: input.alpha,
                meta: input.meta ?? {}
            } as ColorObjectFactory;
        }
    }
    

}