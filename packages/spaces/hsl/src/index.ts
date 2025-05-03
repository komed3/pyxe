'use strict';

import { Registry } from '@pyxe/core/registry';
import { channels } from './handler/channels.js';
import { conversions } from './handler/conversions.js';

Registry.ColorSpace.add( 'hsl', {
    channels: channels,
    alpha: true, linear: false,
    aliases: [ 'hsla' ],
    conversions: conversions,
    output: { html: 'string', css: 'string' },
    meta: {
        name: 'HSL',
        description: 'Cylindrical color space based on RGB'
    }
} );