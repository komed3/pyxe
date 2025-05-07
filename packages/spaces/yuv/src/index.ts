'use strict';

import { Registry } from '@pyxe/core/registry';
import { channels } from './handler/channel.js';
import { conversions } from './handler/conversion.js';

Registry.ColorSpace.add( 'yuv', {
    channels, alpha: true,
    conversions,
    meta: {
        name: 'YUV',
        description: 'Analog video color encoding format separating luminance and chrominance',
        linear: true
    }
} );