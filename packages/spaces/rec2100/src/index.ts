'use strict';

import { Registry } from '@pyxe/core/registry';
import { channels } from './handler/channel.js';
import { conversions_pq, conversions_hlg } from './handler/conversion.js';

Registry.ColorSpace.add( 'rec2100pq', {
    channels, alpha: true,
    conversions: conversions_pq,
    meta: {
        name: 'ITU-R Recommendation BT.2100 PQ',
        description: 'Perceptual quantizer transfer function for HDR, targeting absolute brightness mapping',
        linear: false
    }
} );

Registry.ColorSpace.add( 'rec2100hlg', {
    channels, alpha: true,
    conversions: conversions_hlg,
    meta: {
        name: 'ITU-R Recommendation BT.2100 HLG',
        description: 'Hybrid log-gamma for HDR broadcasting, relative brightness perception model',
        linear: false
    }
} );