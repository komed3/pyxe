'use strict';

import type { ColorInput, ColorObjectFactory, ParserHandler } from '@pyxe/types';
import { Channel } from '@pyxe/utils';

export const parser: ParserHandler = (
    input: ColorInput
) : ColorObjectFactory | undefined => {

    const source = input.toString().trim().toLowerCase();

    const match = source.match(
        /^hsva?\(\s*([\d.]+)(deg|°)?\s*(?:[, ]\s*|[\s])([\d.]+%?)\s*(?:[, ]\s*|[\s])([\d.]+%?)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/
    );

    if ( match ) {

        const h = Channel.parseCyclic( match[ 1 ] );
        const s = Channel.parseLinear( match[ 3 ] );
        const v = Channel.parseLinear( match[ 4 ] );
        const a = Channel.parseAlpha( match[ 5 ] );

        if (
            [ h, s, v ].every( c => ! isNaN( c ) ) &&
            ( a === undefined || ! isNaN( a ) )
        ) {

            return {
                space: 'HSV',
                value: { h, s, v, ...Channel.safeAlpha( a ) },
                meta: { source: input }
            } as ColorObjectFactory;

        }

    }

};