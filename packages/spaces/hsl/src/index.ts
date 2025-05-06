'use strict';

import { Registry } from '@pyxe/core/registry';
import { channels } from './handler/channel.js';
import { conversions } from './handler/conversion.js';

Registry.ColorSpace.add( 'hsl', {
    aliases: [ 'hsla' ],
    channels, alpha: true,
    conversions,
    output: { html: 'string', css: 'string' },
    meta: {
        name: 'HSL',
        description: 'Cylindrical color space based on RGB',
        linear: false
    }
} );