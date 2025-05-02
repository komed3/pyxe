'use strict';

import { Registry } from '@pyxe/core/registry';

Registry.ColorSpace.add( 'hsl', {
    aliases: [ 'hsla' ],
    meta: {
        name: 'HSL',
        description: 'Cylindrical color space based on RGB'
    },
    channels: {
        h: { type: 'cyclic', min: 0, max: 360, decimals: 0, name: 'Hue' },
        s: { type: 'normalized', min: 0, max: 1, decimals: 2, name: 'Saturation' },
        l: { type: 'normalized', min: 0, max: 1, decimals: 2, name: 'Lightness' }
    },
    alpha: true,
    output: {
        html: 'string',
        css: 'string'
    }
} );