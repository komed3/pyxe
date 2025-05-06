'use strict';

import { Registry } from '@pyxe/core/registry';
import { channels } from './handler/channel.js';
import { conversions } from './handler/conversion.js';
import { hooks } from './handler/hook.js';

Registry.ColorSpace.add( 'xyy', {
    channels, alpha: true,
    conversions, hooks,
    meta: {
        name: 'CIE 1931 xyY',
        description: 'Chromaticity coordinates and luminance from XYZ',
        linear: true
    }
} );