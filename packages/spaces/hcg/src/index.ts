'use strict';

import { Registry } from '@pyxe/core/registry';
import { channels } from './handler/channel.js';
import { conversions } from './handler/conversion.js';

Registry.ColorSpace.add( 'hcg', {
    channels, alpha: true,
    conversions,
    meta: {
        name: 'HCG',
        description: 'Hue, chroma and gray components derived directly from RGB',
        linear: false
    }
} );