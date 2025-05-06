'use strict';

import { Registry } from '@pyxe/core/registry';
import { channels } from './handler/channel.js';
import { conversions } from './handler/conversion.js';

Registry.ColorSpace.add( 'lab', {
    aliases: [ 'cielab' ],
    channels, alpha: true,
    conversions,
    meta: {
        name: 'CIEL*a*b*',
        description: 'Perceptually uniform color space based on human vision',
        linear: true
    }
} );