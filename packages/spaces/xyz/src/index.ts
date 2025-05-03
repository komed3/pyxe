'use strict';

import { Registry } from '@pyxe/core/registry';
import { channels } from './handler/channels.js';

Registry.ColorSpace.add( 'xyz', {
    channels: channels,
    alpha: true, linear: true,
    aliases: [ 'ciexyz', 'cie1931' ],
    output: { html: 'string', css: 'string' },
    meta: {
        name: 'CIE 1931 XYZ',
        description: 'Device-independent linear color space defined by the CIE'
    }
} );