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

        const { format = null, decimals = 0, alpha = false } = options;
        const { r, g, b, a } = ( input.value ?? {} ) as RGB;

        const parts = [ r, g, b ].map(
            ( c ) => Channel.format( Channel.clamp( c, 0, 255 ), {
                unit: format, max: 255, decimals: decimals
            } )
        );

        return alpha !== undefined || alpha === true
            ? `rgba( ${ parts.join( ', ' ) }, ${ Channel.formatAlpha( a ) } )`
            : `rgb( ${ parts.join( ', ' ) } )`;

    },

    css: ( ...args ) => (
        output.string as OutputHandler
    )( ...args ),
    html: ( ...args ) => (
        output.string as OutputHandler
    )( ...args )

};