'use strict';

import { Registry } from '@pyxe/core/registry';
import { channels } from './handler/channel.js';
import { conversions } from './handler/conversion.js';

Registry.ColorSpace.add( 'xyz', {
    aliases: [ 'ciexyz', 'cie1931' ],
    channels, alpha: true,
    conversions,
    meta: {
        name: 'CIE 1931 XYZ',
        description: 'Device-independent linear color space defined by the CIE',
        linear: true
    }
} );