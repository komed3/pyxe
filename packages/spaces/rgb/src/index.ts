'use strict';

import { Registry } from '@pyxe/core/registry';
import { channels } from './handler/channel.js';
import { hooks } from './handler/hook.js';
import { conversions } from './handler/conversion.js';
import { output } from './handler/output.js';

Registry.ColorSpace.add( 'rgb', {
    aliases: [ 'rgba', 'srgb', 'srgba', 'hex', '#' ],
    channels, alpha: true,
    hooks, conversions, output,
    meta: {
        name: 'RGB',
        description: 'Additive red-green-blue color model using 8-bit channels',
        linear: false
    }
} );