'use strict';

import { ColorInput, ColorObject, ParserHandler } from '@pyxe/types';

export const parser: ParserHandler = (
    input: ColorInput
) => {

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

        const red = _channel( match[1] );
        const green = _channel( match[2] );
        const blue = _channel( match[3] );

        let alpha = match[4]
            ? _channel( match[4], 1 )
            : undefined;

        if (
            [ red, green, blue ].map( c => ! isNaN( c ) ) &&
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
            } as ColorObject;

        }

    }

    return undefined;

}