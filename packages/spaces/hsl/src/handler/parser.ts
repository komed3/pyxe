'use strict';

import type { ColorInput, ColorObjectFactory, ParserHandler } from '@pyxe/types';
import { Channel } from '@pyxe/utils';

export const parser: ParserHandler = (
    input: ColorInput
) : ColorObjectFactory | undefined => {

    const source = input.toString().trim().toLowerCase();

    const match = source.match(
        /^hsla?\(\s*([\d.]+)(deg|°)?\s*(?:[, ]\s*|[\s])([\d.]+%?)\s*(?:[, ]\s*|[\s])([\d.]+%?)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/
    );

    if ( match ) {

        const hue = Channel.parseCyclic( match[ 1 ] );
        const saturation = Channel.parseLinear( match[ 3 ] );
        const lightness = Channel.parseLinear( match[ 4 ] );

        const alpha = match[ 5 ]
            ? Channel.parseLinear( match[ 5 ] )
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