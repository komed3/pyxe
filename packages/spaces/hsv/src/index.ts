'use strict';

import { Registry } from '@pyxe/core/registry';
import { channels } from './handler/channels.js';
import { conversions } from './handler/conversions.js';

Registry.ColorSpace.add( 'hsv', {
    aliases: [ 'hsva', 'hsb', 'hsba' ],
    meta: {
        name: 'HSV',
        description: 'Hue-based model for brightness and saturation control'
    },
    channels,
    alpha: true,
    output: {
        html: 'string',
        css: 'string'
    },
    conversions
} );