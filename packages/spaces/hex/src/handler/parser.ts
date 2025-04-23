'use strict';

import { ColorInput, ColorObjectFactory, ParserHandler } from '@pyxe/types';

export const parser: ParserHandler = (
    input: ColorInput
) : ColorObjectFactory | undefined => {

    const match = input.toString().trim().toLowerCase().match(
        /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i
    );

    if ( match ) {

        return {
            space: 'HEX',
            value: ( ( h: string ) =>
                h.length === 3 ? `#${h[0]}${h[0]}${h[1]}${h[1]}${h[2]}${h[2]}` :
                h.length === 4 ? `#${h[0]}${h[0]}${h[1]}${h[1]}${h[2]}${h[2]}${h[3]}${h[3]}` :
                `#${h}` )( match[1] ),
            meta: { source: input }
        } as ColorObjectFactory;

    }

}