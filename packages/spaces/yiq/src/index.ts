'use strict';

import { Registry } from '@pyxe/core/registry';
import { channels } from './handler/channel.js';
import { conversions } from './handler/conversion.js';

Registry.ColorSpace.add( 'yiq', {
    channels, alpha: true,
    conversions,
    meta: {
        name: 'yiq',
        description: 'NTSC analog TV color space optimized for human perception',
        linear: true
    }
} );