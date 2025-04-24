'use strict';

import type { HSL, ColorObjectFactory, OutputFactory, OutputHandler } from '@pyxe/types';
import { Channel } from '@pyxe/utils';

export const output: OutputFactory = {

    string: (
        input: ColorObjectFactory,
        options: {
            format?: 'percent';
            decimals?: number,
            alpha?: boolean;
        } = {}
    ) : string => {

        const { format = 'percent', decimals = 0, alpha = false } = options;
        const { h, s, l, a } = ( input.value ?? {} ) as HSL;

        const parts = [
            Channel.format( h, { unit: 'deg', max: 360, decimals: decimals } ), 
            Channel.format( s, { unit: format, max: 1, decimals: decimals } ), 
            Channel.format( l, { unit: format, max: 1, decimals: decimals } )
        ];

        return a !== undefined || alpha === true
            ? `hsla( ${ parts.join( ', ' ) }, ${ Channel.formatAlpha( a ) } )`
            : `hsl( ${ parts.join( ', ' ) } )`;

    },

    css: ( ...args ) => (
        output.string as OutputHandler
    )( ...args ),
    html: ( ...args ) => (
        output.string as OutputHandler
    )( ...args )

};