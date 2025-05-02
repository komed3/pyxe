'use strict';

import { Registry } from '@pyxe/core/registry';
import { hooksHandler } from './handler/hooks.js';
import { outputHandler } from './handler/output.js';

Registry.ColorSpace.add( 'rgb', {
    aliases: [ 'rgba', 'hex', '#' ],
    meta: {
        name: 'RGB',
        description: 'Additive red-green-blue color model using 8-bit channels'
    },
    channels: {
        r: { type: 'numeric', min: 0, max: 255, decimals: 0, name: 'Red' },
        g: { type: 'numeric', min: 0, max: 255, decimals: 0, name: 'Green' },
        b: { type: 'numeric', min: 0, max: 255, decimals: 0, name: 'Blue' }
    },
    alpha: true,
    hooks: hooksHandler,
    output: outputHandler
} );