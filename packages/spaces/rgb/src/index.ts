'use strict';

import { Registry } from '@pyxe/core/registry';
import { channels } from './handler/channels.js';
import { gamma } from './handler/gamma.js';
import { hooks } from './handler/hooks.js';
import { conversions } from './handler/conversions.js';
import { output } from './handler/output.js';

Registry.ColorSpace.add( 'rgb', {
    channels: channels,
    alpha: true, linear: false,
    gamma: gamma,
    aliases: [ 'rgba', 'hex', '#' ],
    hooks: hooks,
    conversions: conversions,
    output: output,
    meta: {
        name: 'RGB',
        description: 'Additive red-green-blue color model using 8-bit channels'
    }
} );