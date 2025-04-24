'use strict';

import { ColorObjectFactory, ConversionFactory } from '@pyxe/types';
import { Transform } from '@pyxe/utils';

export const conversions: ConversionFactory = {

    RGB: (
        input: ColorObjectFactory | undefined
    ) : ColorObjectFactory | undefined => {

        if ( input && input.space === 'HEX' ) {

            const clean = (
                typeof input.value === 'string'
                    ? input.value.trim()
                    : ''
            ).replace( /^#/, '' );

            if ( [ 3, 4, 6, 8 ].includes( clean.length ) ) {

                const [ r, g, b, a ] = (
                    clean.length <= 4 
                        ? [ 0, 1, 2, 3 ].map( i => Transform.hexdec( clean[ i ].repeat( 2 ) ) ) 
                        : [ 0, 2, 4, 6 ].map( i => Transform.hexdec( clean.slice( i, i + 2 ) ) )
                );

                return {
                    space: 'RGB',
                    value: { r, g, b, ...(
                        clean.length % 4 === 0 ? { a: a / 255 } : {}
                    ) },
                    meta: input.meta ?? {}
                } as ColorObjectFactory;

            }

        }

        return undefined;

    }

};