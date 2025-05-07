'use strict';

import type { ColorChannel } from '@pyxe/types';

export const channels: Record<string, ColorChannel> = {
    y: { type: 'normalized', min: 0, max: 1, decimals: 4, name: 'Luminance' },
    i: { type: 'numeric', min: -0.5957, max: 0.5957, decimals: 4, name: 'In-phase' },
    q: { type: 'numeric', min: -0.5226, max: 0.5226, decimals: 4, name: 'Quadrature' }
};