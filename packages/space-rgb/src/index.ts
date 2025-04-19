'use strict';

import { _ColorSpace } from '@pyxe/core/dev';

import { validator } from './lib/validator.js';
import { parser } from './lib/parser.js';
import { conversions } from './lib/conversions.js';
import { output } from './lib/output.js';

_ColorSpace.colorSpace._register( 'RGB', {
    id: 'RGB',
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
            a: { name: 'Alpha', range: [ 0, 1 ] }
        },
        spaces: [ 'HEX' ],
        output: [ 'string', 'css', 'html' ],
        cssSupport: true
    }
} );