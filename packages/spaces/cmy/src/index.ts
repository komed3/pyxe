'use strict';

import { Registry } from '@pyxe/core/registry';
import { channels } from './handler/channel.js';
import { conversions } from './handler/conversion.js';

Registry.ColorSpace.add( 'cmy', {
    channels, alpha: true,
    conversions,
    meta: {
        name: 'CMY',
        description: 'Subtractive color model using Cyan, Magenta, and Yellow components',
        linear: false
    }
} );