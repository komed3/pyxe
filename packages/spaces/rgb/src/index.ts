'use strict';

import { colorSpaceRegistry } from '@pyxe/core/root';

colorSpaceRegistry.add( 'RGB', {
    name: 'RGB',
    validator: ( i ) => true,
    parser: ( i ) => ( { space: 'RGB', value: { r: 0, g: 0, b: 0 } } ),
    conversions: {},
    output: {},
    meta: {
        name: 'RGB',
        description: 'Additive red-green-blue color model using 8-bit channels',
        type: 'numeric',
        alpha: true,
        channels: {
            r: { name: 'Red', range: [ 0, 255 ] },
            g: { name: 'Green', range: [ 0, 255 ] },
            b: { name: 'Blue', range: [ 0, 255 ] },
            a: { name: 'Alpha', range: [ 0, 1 ] }
        },
        spaces: [ 'HEX' ],
        output: [ 'string', 'css', 'html' ],
        cssSupport: true
    }
} );