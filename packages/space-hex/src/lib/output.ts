'use strict';

import { ColorObject, OutputFactory, OutputHandler } from '@pyxe/types';

export const output: OutputFactory = {

    string: (
        input: ColorObject,
        options: {
            format?: 'short' | 'long';
            alpha?: boolean;
        } = {}
    ) : string => {

        const raw = input.value.toString().replace( /^#/, '' ).toLowerCase();

        const [ red, green, blue, alpha ] = [
            raw.slice( 0, 2 ), raw.slice( 2, 4 ), raw.slice( 4, 6 ),
            raw.length === 8 ? raw.slice( 6, 8 ) : options.alpha ? 'ff' : undefined
        ];

        return (
            options.format === 'short' && (
                red[0] === red[1] && green[0] === green[1] && blue[0] === blue[1] &&
                ( ! alpha || alpha[0] === alpha[1] )
            )
        )
            ? `#${red[0]}${green[0]}${blue[0]}${ ( alpha ? alpha[0] : '' ) }`
            : `#${red}${green}${blue}${ ( alpha ?? '' ) }`;

    },

    css: ( ...args ) => (
        output.string as OutputHandler
    )( ...args ),
    html: ( ...args ) => (
        output.string as OutputHandler
    )( ...args )

};