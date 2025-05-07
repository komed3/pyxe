'use strict';

import { Registry } from '@pyxe/core/registry';
import { channels } from './handler/channel.js';
import { conversions } from './handler/conversion.js';

Registry.ColorSpace.add( 'ypbpr', {
    channels, alpha: true,
    conversions,
    meta: {
        name: 'Y′PbPr',
        description: 'Component video format used in analog HD signal transmission',
        linear: true
    }
} );