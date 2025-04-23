'use strict';

import { colorSpaceRegistry } from '@pyxe/core/root';

import { validator } from './handler/validator.js';
import { parser } from './handler/parser.js';
import { conversions } from './handler/conversions.js';
import { output } from './handler/output.js';

colorSpaceRegistry.add( 'HEX', {
    name: 'HEX',
    validator: validator,
    parser: parser,
    conversions: conversions,
    output: output,
    meta: {
        name: 'Hexadecimal RGB',
        description: 'Hexadecimal coded RGB color space, widely used in the web and CSS',
        type: 'encoded',
        alpha: true,
        channels: {
            r: { name: 'Red', range: [ 0, 255 ] },
            g: { name: 'Green', range: [ 0, 255 ] },
            b: { name: 'Blue', range: [ 0, 255 ] },
            a: { name: 'Alpha', range: [ 0, 255 ] }
        },
        spaces: [ 'RGB' ],
        output: [ 'string', 'css', 'html' ],
        cssSupport: true
    }
} );