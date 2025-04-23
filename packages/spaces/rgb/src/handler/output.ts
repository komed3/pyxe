'use strict';

import type { RGB, ColorObjectFactory, OutputFactory, OutputHandler } from '@pyxe/types';
import { Channel } from '@pyxe/utils';

export const output: OutputFactory = {

    string: (
        input: ColorObjectFactory,
        options: {
            format?: 'hex' | 'percent';
            decimals?: number,
            alpha?: boolean;
        } = {}
    ) : string => {

        const { r: red, g: green, b: blue, a: alpha } = ( input.value ?? {} ) as RGB;
        const { format = null, decimals = 0, alpha: showAlpha = false } = options;

        const parts = [ red, green, blue ].map(
            ( c ) => Channel.format( c, {
                unit: format, max: 255, decimals: decimals
            } )
        );

        return alpha !== undefined || showAlpha === true
            ? `rgba( ${ parts.join( ', ' ) }, ${ Channel.formatAlpha( alpha ) } )`
            : `rgb( ${ parts.join( ', ' ) } )`;

    },

    css: ( ...args ) => (
        output.string as OutputHandler
    )( ...args ),
    html: ( ...args ) => (
        output.string as OutputHandler
    )( ...args )

};