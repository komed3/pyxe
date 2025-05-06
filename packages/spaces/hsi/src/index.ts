'use strict';

import { Registry } from '@pyxe/core/registry';
import { channels } from './handler/channel.js';
import { conversions } from './handler/conversion.js';

Registry.ColorSpace.add( 'hsi', {
    aliases: [ 'hsia' ],
    channels, alpha: true,
    conversions,
    meta: {
        name: 'HSI',
        description: 'Hue-Saturation-Intensity color space, perceptually oriented',
        linear: false
    }
} );