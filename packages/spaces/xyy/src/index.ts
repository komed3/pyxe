'use strict';

import { Registry } from '@pyxe/core/registry';
import { channels } from './handler/channel.js';
import { hooks } from './handler/hook.js';
import { conversions } from './handler/conversion.js';
import { output } from './handler/output.js';

Registry.ColorSpace.add( 'xyy', {
    aliases: [ 'yxy' ],
    channels, alpha: true,
    hooks, conversions, output,
    meta: {
        name: 'CIE 1931 xyY',
        description: 'Chromaticity coordinates and luminance from XYZ',
        linear: true
    }
} );