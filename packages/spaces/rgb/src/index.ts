'use strict';

import { Registry } from '@pyxe/core/registry';
import { channels } from './handler/channels.js';
import { conversions } from './handler/conversions.js';
import { output } from './handler/output.js';
import { hooks } from './handler/hooks.js';

Registry.ColorSpace.add( 'rgb', {
    channels, alpha: true, conversions,
    output, hooks,
    aliases: [ 'rgba', 'hex', '#' ],
    meta: {
        name: 'RGB',
        description: 'Additive red-green-blue color model using 8-bit channels'
    }
} );