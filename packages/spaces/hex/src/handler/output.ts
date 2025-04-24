'use strict';

import { ColorObjectFactory, OutputFactory, OutputHandler } from '@pyxe/types';

export const output: OutputFactory = {

    string: (
        input: ColorObjectFactory,
        options: {
            format?: 'short' | 'long';
            alpha?: boolean;
        } = {}
    ) : string => {

        const { format = 'long', alpha = false } = options;
        const raw = input.value.toString().replace( /^#/, '' ).toLowerCase();

        const [ r, g, b, a ] = [
            raw.slice( 0, 2 ), raw.slice( 2, 4 ), raw.slice( 4, 6 ),
            raw.length === 8 ? raw.slice( 6, 8 ) : alpha ? 'ff' : undefined
        ];

        return (
            format === 'short' && (
                r[0] === r[1] && g[0] === g[1] && b[0] === b[1] &&
                ( ! a || a[0] === a[1] )
            )
        )
            ? `#${r[0]}${g[0]}${b[0]}${ ( a ? a[0] : '' ) }`
            : `#${r}${g}${b}${ ( a ?? '' ) }`;

    },

    css: ( ...args ) => (
        output.string as OutputHandler
    )( ...args ),
    html: ( ...args ) => (
        output.string as OutputHandler
    )( ...args )

};