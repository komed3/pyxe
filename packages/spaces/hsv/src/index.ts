'use strict';

import { colorSpaceRegistry } from '@pyxe/core/root';

import { validator } from './handler/validator.js';
import { parser } from './handler/parser.js';
import { conversions } from './handler/conversions.js';
import { output } from './handler/output.js';

colorSpaceRegistry.add( 'HSV', {
    name: 'HSV',
    aliases: [ 'hsv', 'HSVA', 'hsva', 'HSB', 'hsb', 'HSBA', 'hsba' ],
    validator: validator,
    parser: parser,
    conversions: conversions,
    output: output,
    meta: {
        name: 'HSV',
        description: 'Hue-based model for brightness and saturation control',
        type: 'numeric',
        alpha: true,
        channels: {
            h: { name: 'Hue', range: [ 0, 360 ], unit: 'degrees' },
            s: { name: 'Saturation', range: [ 0, 1 ], unit: 'ratio' },
            v: { name: 'Brightness', range: [ 0, 1 ], unit: 'ratio' },
            a: { name: 'Alpha', range: [ 0, 1 ], unit: 'ratio' }
        },
        spaces: [ 'RGB', 'HSL' ],
        output: [ 'string' ],
        cssSupport: false
    }
} );