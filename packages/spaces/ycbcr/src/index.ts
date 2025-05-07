'use strict';

import { Registry } from '@pyxe/core/registry';
import { channels } from './handler/channel.js';
import { conversions } from './handler/conversion.js';

Registry.ColorSpace.add( 'ycbcr', {
    channels, alpha: true,
    conversions,
    meta: {
        name: 'Y′CbCr',
        description: 'Digital video color space for compression and broadcast formats',
        linear: true
    }
} );