'use strict';

import { Registry } from '@pyxe/core/registry';
import { channels } from './handler/channels.js';
import { conversions } from './handler/conversions.js';

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