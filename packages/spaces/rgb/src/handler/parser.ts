'use strict';

import type { ColorInput, ColorObjectFactory, ParserHandler } from '@pyxe/types';
import { Channel } from '@pyxe/utils';

export const parser: ParserHandler = (
    input: ColorInput
) : ColorObjectFactory | undefined => {
 
    const match = input.toString().trim().toLowerCase().match(
        /^rgba?\(\s*([\d.]+%?)\s*[, ]\s*([\d.]+%?)\s*[, ]\s*([\d.]+%?)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/
    );

    if ( match ) {

        const _channel = (
            v: string, max: number = 255
        ) : number => (
            v.endsWith( '%' )
                ? ( parseFloat( v ) / 100 ) * max
                : parseFloat( v )
        );

        const r = Channel.parseLinear( match[ 1 ], 255 );
        const g = Channel.parseLinear( match[ 2 ], 255 );
        const b = Channel.parseLinear( match[ 3 ], 255 );
        const a = Channel.parseAlpha( match[ 4 ] );

        if (
            [ r, g, b ].every( c => ! isNaN( c ) ) &&
            ( a === undefined || ! isNaN( a ) )
        ) {

            return {
                space: 'RGB',
                value: { r, g, b, ...(
                    a !== undefined ? { a } : {}
                ) },
                meta: { source: input }
            } as ColorObjectFactory;

        }

    }

}