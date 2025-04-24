'use strict';

import { colorSpaceRegistry } from '@pyxe/core/root';

import { validator } from './handler/validator.js';
import { parser } from './handler/parser.js';
import { conversions } from './handler/conversions.js';
import { output } from './handler/output.js';

colorSpaceRegistry.add( 'RGB', {
    name: 'RGB',
    validator: validator,
    parser: parser,
    conversions: conversions,
    output: output,
    meta: {
        name: 'RGB',
        description: 'Additive red-green-blue color model using 8-bit channels',
        type: 'numeric',
        alpha: true,
        channels: {
            r: { name: 'Red', range: [ 0, 255 ] },
            g: { name: 'Green', range: [ 0, 255 ] },
            b: { name: 'Blue', range: [ 0, 255 ] },
            a: { name: 'Alpha', range: [ 0, 1 ], unit: 'ratio' }
        },
        spaces: [ 'HEX', 'HSL' ],
        output: [ 'string', 'css', 'html' ],
        cssSupport: true
    }
} );