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

        const red = Channel.parseLinear( match[ 1 ], 255 );
        const green = Channel.parseLinear( match[ 2 ], 255 );
        const blue = Channel.parseLinear( match[ 3 ], 255 );

        const alpha = match[ 4 ]
            ? Channel.parseLinear( match[ 4 ] )
            : undefined;

        if (
            [ red, green, blue ].every( c => ! isNaN( c ) ) &&
            ( alpha === undefined || ! isNaN( alpha ) )
        ) {

            return {
                space: 'RGB',
                value: {
                    r: red, g: green, b: blue,
                    ...( alpha !== undefined ? {
                        a: alpha
                    } : {} )
                },
                meta: { source: input }
            } as ColorObjectFactory;

        }

    }

}