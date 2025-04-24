'use strict';

import { ColorObjectFactory, ConversionFactory } from '@pyxe/types';

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

                const _expand = ( v: string ) : string => v && v.length === 1 ? v + v : v;
                const _parse = ( v: string ) : number => parseInt( v, 16 );

                const [ r, g, b, a ] = (
                    clean.length <= 4 
                        ? [ 0, 1, 2, 3 ].map( i => _parse( _expand( clean[ i ] ) ) ) 
                        : [ 0, 2, 4, 6 ].map( i => _parse( clean.slice( i, i + 2 ) ) )
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