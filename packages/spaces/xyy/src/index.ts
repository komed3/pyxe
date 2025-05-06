'use strict';

import { Registry } from '@pyxe/core/registry';
import { channels } from './handler/channel.js';
import { conversions } from './handler/conversion.js';

Registry.ColorSpace.add( 'xyy', {
    channels, alpha: true,
    conversions,
    meta: {
        name: 'CIE 1931 xyY',
        description: 'Chromaticity coordinates and luminance from XYZ',
        linear: true
    }
} );