'use strict';

import { Registry } from '@pyxe/core/registry';
import { channels } from './handler/channels.js';
import { conversions } from './handler/conversions.js';

Registry.ColorSpace.add( 'hsl', {
    aliases: [ 'hsla' ],
    meta: {
        name: 'HSL',
        description: 'Cylindrical color space based on RGB'
    },
    channels,
    alpha: true,
    output: {
        html: 'string',
        css: 'string'
    },
    conversions
} );