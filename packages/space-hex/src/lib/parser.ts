'use strict';

import { ColorInput, ColorObject, ParserHandler } from '@pyxe/types';

export const parser: ParserHandler = (
    input: ColorInput
) => {

    const match = input.toString().trim().toLowerCase().match(
        /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i
    );

    if ( match ) {

        const _expandHex = ( h: string ) => h.length === 3
            ? h.split( '' ).map(
                ( c ) => c + c
            ).join( '' )
            : h.length === 4
                ? h.split( '' ).map(
                    ( c, i ) => i < 3 ? c + c : c
                ).join( '' )
                : h;

        return {
            space: 'HEX',
            value: `#${ _expandHex( match[ 1 ] ) }`,
            meta: { source: input }
        } as ColorObject;

    }

    return undefined;

}