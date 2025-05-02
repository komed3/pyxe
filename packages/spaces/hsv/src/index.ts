'use strict';

import { Registry } from '@pyxe/core/registry';

Registry.ColorSpace.add( 'hsv', {
    aliases: [ 'hsva', 'hsb', 'hsba' ],
    meta: {
        name: 'HSV',
        description: 'Hue-based model for brightness and saturation control'
    },
    channels: {
        h: { type: 'cyclic', min: 0, max: 360, decimals: 0, name: 'Hue' },
        s: { type: 'normalized', min: 0, max: 1, decimals: 2, name: 'Saturation' },
        v: { type: 'normalized', min: 0, max: 1, decimals: 2, name: 'Brightness' }
    },
    alpha: true,
    output: {
        html: 'string',
        css: 'string'
    }
} );