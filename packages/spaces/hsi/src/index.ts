'use strict';

import { Registry } from '@pyxe/core/registry';
import { channels } from './handler/channels.js';
import { conversions } from './handler/conversions.js';

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