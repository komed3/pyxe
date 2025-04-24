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

        const h = Channel.parseCyclic( match[ 1 ] );
        const s = Channel.parseLinear( match[ 3 ] );
        const l = Channel.parseLinear( match[ 4 ] );
        const a = Channel.parseAlpha( match[ 5 ] );

        if (
            [ h, s, l ].every( c => ! isNaN( c ) ) &&
            ( a === undefined || ! isNaN( a ) )
        ) {

            return {
                space: 'HSL',
                value: { h, s, l, ...(
                    a !== undefined ? { a } : {}
                ) },
                meta: { source: input }
            } as ColorObjectFactory;

        }

    }

};