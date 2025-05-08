'use strict';

import { Registry } from '@pyxe/core/registry';
import { channels } from './handler/channel.js';
import { conversions } from './handler/conversion.js';

Registry.ColorSpace.add( 'rec2020', {
    aliases: [ 'bt2020', 'itu-r2020', 'uhdtv' ],
    channels, alpha: true,
    conversions,
    meta: {
        name: 'ITU-R Recommendation BT.2020',
        description: 'UHDTV RGB space with wide gamut and nonlinear encoding',
        linear: false
    }
} );