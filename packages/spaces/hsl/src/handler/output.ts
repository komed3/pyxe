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

        const { h: hue, s: saturation, l: lightness, a: alpha = 1 } = ( input.value ?? {} ) as HSL;
        const { format = 'percent', decimals = 0, alpha: showAlpha = false } = options;

        const parts = [
            Channel.format( hue, { unit: 'deg', max: 360, decimals: decimals } ), 
            Channel.format( saturation, { unit: format, max: 1, decimals: decimals } ), 
            Channel.format( lightness, { unit: format, max: 1, decimals: decimals } )
        ];

        return alpha !== undefined || showAlpha === true
            ? `hsla( ${ parts.join( ', ' ) }, ${ ( Channel.format( alpha ?? 1, {
                unit: null, max: 1, decimals: 2
            } ) ) } )`
            : `hsl( ${ parts.join( ', ' ) } )`;

    },

    css: ( ...args ) => (
        output.string as OutputHandler
    )( ...args ),
    html: ( ...args ) => (
        output.string as OutputHandler
    )( ...args )

};