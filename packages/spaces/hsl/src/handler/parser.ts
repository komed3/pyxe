'use strict';

import type { ColorInput, ColorObjectFactory, ParserHandler } from '@pyxe/types';

export const parser: ParserHandler = (
    input: ColorInput
) : ColorObjectFactory | undefined => {

    const source = input.toString().trim().toLowerCase();

    const match = source.match(
        /^hsla?\(\s*([\d.]+)(deg|°)?\s*(?:[, ]\s*|[\s])([\d.]+%?)\s*(?:[, ]\s*|[\s])([\d.]+%?)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/
    );

    if ( match ) {

        const _parseHue = (
            v: string
        ) : number => (
            ( ( parseFloat( v ) % 360 ) + 360 ) % 360
        );
    
        const _parseRatio = (
            v: string
        ) : number => (
            v.endsWith( '%' )
                ? parseFloat( v ) / 100
                : parseFloat( v )
        );

        const hue = _parseHue( match[ 1 ] );
        const saturation = _parseRatio( match[ 3 ] );
        const lightness = _parseRatio( match[ 4 ] );

        const alpha = match[ 5 ]
            ? _parseRatio( match[ 5 ] )
            : undefined;

        if (
            [ hue, saturation, lightness ].every( c => ! isNaN( c ) ) &&
            ( alpha === undefined || ! isNaN( alpha ) )
        ) {

            return {
                space: 'HSL',
                value: {
                    h: hue, s: saturation, l: lightness,
                    ...( alpha !== undefined ? {
                        a: alpha
                    } : {} )
                },
                meta: { source: input }
            } as ColorObjectFactory;

        }

    }

};