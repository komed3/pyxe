'use strict';

import { Registry } from '@pyxe/core/registry';
import { channels } from './handler/channel.js';
import { conversions } from './handler/conversion.js';

Registry.ColorSpace.add( 'lms', {
    channels, alpha: true,
    conversions,
    meta: {
        name: 'LMS',
        description: 'Physiologically-based color space modeling cone responses (L, M, S) derived from XYZ',
        linear: true
    }
} );