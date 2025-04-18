'use strict';

import { RGB, ColorObject, OutputHandler, OutputTypes } from '@pyxe/types';

export const output: Record<OutputTypes, OutputHandler> = {

    string: (
        input: ColorObject,
        options: {
            format?: 'hex' | 'percent';
            alpha?: boolean;
        } = {}
    ) : string => {

        const { r: red, g: green, b: blue, a: alpha } = ( input.value ?? {} ) as RGB;

        const _toString = (
            v: number
        ) : string => (
            options.format === 'percent'
                ? `${ ( v / 255 * 100 ).toFixed( 0 ) }%`
                : `${ Math.round( v ) }`
        );

        const parts = [ red, green, blue ].map( _toString );

        return alpha !== undefined || options.alpha === true
            ? `rgba( ${ parts.join( ', ' ) }, ${ ( alpha !== undefined
                  ? ( alpha <= 1 ? alpha : alpha / 255 ).toFixed( 2 ).replace( /\.?0+$/, '' )
                  : '1' ) } )`
            : `rgb( ${ parts.join( ', ' ) } )`;

    },

    css: ( ...args ) => output.string( ...args ),
    html: ( ...args ) => output.string( ...args )

};