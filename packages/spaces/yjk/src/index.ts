'use strict';

import { Registry } from '@pyxe/core/registry';
import { channels } from './handler/channel.js';
import { conversions } from './handler/conversion.js';

Registry.ColorSpace.add( 'yjk', {
    channels, alpha: true,
    conversions,
    meta: {
        name: 'YJK',
        description: 'Low-bandwidth YUV variant used in Philips CD-i system',
        linear: false
    }
} );