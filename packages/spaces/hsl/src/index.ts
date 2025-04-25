'use strict';

import { colorSpaceRegistry } from '@pyxe/core/root';

import { conversions } from './handler/conversions.js';
import { output } from './handler/output.js';
import { parser } from './handler/parser.js';
import { validator } from './handler/validator.js';

colorSpaceRegistry.add( 'HSL', {
    name: 'HSL',
    aliases: [ 'hsl', 'HSLA', 'hsla' ],
    validator: validator,
    parser: parser,
    conversions: conversions,
    output: output,
    meta: {
        name: 'HSL',
        description: 'Cylindrical color space based on RGB',
        type: 'numeric',
        alpha: true,
        channels: {
            h: { name: 'Hue', range: [ 0, 360 ], unit: 'degrees' },
            s: { name: 'Saturation', range: [ 0, 1 ], unit: 'ratio' },
            l: { name: 'Lightness', range: [ 0, 1 ], unit: 'ratio' },
            a: { name: 'Alpha', range: [ 0, 1 ], unit: 'ratio' }
        },
        spaces: [ 'RGB', 'HSV' ],
        output: [ 'string', 'css', 'html' ],
        cssSupport: true
    }
} );