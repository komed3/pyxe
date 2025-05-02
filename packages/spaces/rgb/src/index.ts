'use strict';

import { Registry } from '@pyxe/core/registry';
import { channels } from './handler/channels.js';
import { output } from './handler/output.js';
import { conversions } from './handler/conversions.js';
import { hooks } from './handler/hooks.js';

Registry.ColorSpace.add( 'rgb', {
    aliases: [ 'rgba', 'hex', '#' ],
    meta: {
        name: 'RGB',
        description: 'Additive red-green-blue color model using 8-bit channels'
    },
    channels: channels,
    alpha: true,
    output: output,
    conversions: conversions,
    hooks: hooks
} );