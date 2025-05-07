'use strict';

import { Registry } from '@pyxe/core/registry';
import { channels } from './handler/channel.js';
import { conversions } from './handler/conversion.js';

Registry.ColorSpace.add( 'hwb', {
    aliases: [ 'hwba' ],
    channels, alpha: true,
    conversions,
    meta: {
        name: 'HWB',
        description: 'Hue-based model with whiteness and blackness proportions from RGB',
        linear: false
    }
} );