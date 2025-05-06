'use strict';

import { Registry } from '@pyxe/core/registry';
import { channels } from './handler/channels.js';
import { conversions } from './handler/conversions.js';

Registry.ColorSpace.add( 'hsv', {
    aliases: [ 'hsva', 'hsb', 'hsba' ],
    channels, alpha: true,
    conversions,
    output: { html: 'string', css: 'string' },
    meta: {
        name: 'HSV',
        description: 'Hue-based model for brightness and saturation control',
        linear: false
    }
} );