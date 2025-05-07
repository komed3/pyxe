'use strict';

import { Registry } from '@pyxe/core/registry';
import { channels } from './handler/channel.js';
import { conversions } from './handler/conversion.js';

Registry.ColorSpace.add( 'ydbdr', {
    channels, alpha: true,
    conversions,
    meta: {
        name: 'YDbDr',
        description: 'Used in SECAM analog television broadcasting for color separation',
        linear: true
    }
} );