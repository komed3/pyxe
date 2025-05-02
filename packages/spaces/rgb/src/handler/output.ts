'use strict';

import type { RGB, OutputFactory } from '@pyxe/types';
import { ErrorUtils } from '@pyxe/core/services';

export const output: OutputFactory = {

    html: 'string',
    css: 'string',

    hex: ( input, options ) : string => {

        ErrorUtils.assert( input.space === 'rgb', {
            method: 'Space::RGB',
            msg: `Output format <hex> does not support color space <${input.space}>`
        } );

        const { r, g, b } = input.value as RGB;

        const dec2hex = ( val: number, short?: boolean ) : string => short
            ? ( val >> 4 ).toString( 16 )
            : val.toString( 16 ).padStart( 2, '0' );

        const canShorten = options?.short && [ r, g, b ].every(
            ( val ) => ( val & 0xf0 ) >> 4 === ( val & 0x0f )
        );

        const hex = `#${ [ r, g, b ].map( ( val ) => dec2hex( val, canShorten ) ).join( '' ) }`;

        return options?.forceAlpha || ( input.alpha !== undefined && input.alpha !== 1 )
            ? hex + dec2hex( Math.round( ( input.alpha ?? 1 ) * 255 ), options?.short )
            : hex;

    }

};