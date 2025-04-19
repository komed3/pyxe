'use strict';

import { _ColorSpace } from '@pyxe/core/dev';
import { validator } from './lib/validator.js';
import { parser } from './lib/parser.js';
import { output } from './lib/output.js';

_ColorSpace.colorSpace._register( 'HEX', {
    id: 'HEX',
    validator: validator,
    parser: parser,
    output: output,
    meta: {
        name: 'Hexadecimal RGB',
        description: 'Hexadecimal coded RGB color space, widely used in the web and CSS.',
        type: 'encoded',
        channels: {
            r: { name: 'Red', range: [ 0, 255 ] },
            g: { name: 'Green', range: [ 0, 255 ] },
            b: { name: 'Blue', range: [ 0, 255 ] },
            a: { name: 'Alpha', range: [ 0, 255 ] }
        },
        alpha: true,
        spaces: [ 'RGB' ],
        output: [ 'string', 'css', 'html' ],
        cssSupport: true
    }
} );