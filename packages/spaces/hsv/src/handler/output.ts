'use strict';

import type { HSV, ColorObjectFactory, OutputFactory } from '@pyxe/types';
import { Channel } from '@pyxe/utils';

export const output: OutputFactory = {

    string: (
        input: ColorObjectFactory,
        options: {
            format?: 'percent' | 'normalized';
            decimals?: number,
            alpha?: boolean;
        } = {}
    ) : string => {

        const { format = 'percent', decimals = 2, alpha = false } = options;
        const { h, s, v, a } = ( input.value ?? {} ) as HSV;

        const parts = [
            Channel.format( h, { unit: 'deg', max: 360, decimals: decimals } ), 
            Channel.format( s, { unit: format, max: 1, decimals: decimals } ), 
            Channel.format( v, { unit: format, max: 1, decimals: decimals } )
        ];

        return a !== undefined || alpha === true
            ? `hsva( ${ parts.join( ', ' ) }, ${ Channel.formatAlpha( a ) } )`
            : `hsv( ${ parts.join( ', ' ) } )`;

    }

};