'use strict';

import { Registry } from '@pyxe/core/registry';
import { channels } from './handler/channel.js';
import { conversions } from './handler/conversion.js';

Registry.ColorSpace.add( 'rec709', {
    aliases: [ 'bt709', 'itu-r709', 'hdtv' ],
    channels, alpha: true,
    conversions,
    meta: {
        name: 'ITU-R Recommendation 709',
        description: 'HDTV standard RGB encoding with gamma-based transfer and D65',
        linear: false
    }
} );