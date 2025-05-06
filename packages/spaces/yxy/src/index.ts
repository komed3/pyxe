'use strict';

import { Registry } from '@pyxe/core/registry';
import { channels } from './handler/channel.js';
import { conversions } from './handler/conversion.js';

Registry.ColorSpace.add( 'yxy', {
    channels, alpha: true,
    conversions,
    meta: {
        name: 'CIE 1931 Yxy',
        description: 'Luminance and chromaticity based on XYZ',
        linear: true
    }
} );