'use strict';

import { Registry } from '@pyxe/core/registry';
import { channels } from './handler/channel.js';
import { conversions } from './handler/conversion.js';

Registry.ColorSpace.add( 'lrgb', {
    aliases: [ 'lrgba' ],
    channels, alpha: true,
    conversions,
    meta: {
        name: 'Linear RGB',
        description: 'Gamma-free RGB space used in XYZ and Lab conversions',
        linear: true
    }
} );