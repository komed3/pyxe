'use strict';

import { Registry } from '@pyxe/core/registry';
import { channels } from './handler/channel.js';
import { conversions } from './handler/conversion.js';

Registry.ColorSpace.add( 'cmyk', {
    channels, alpha: true,
    conversions,
    meta: {
        name: 'CMYK',
        description: 'Extended CMY model with Black (Key) for deeper shadows',
        linear: false
    }
} );