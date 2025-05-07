'use strict';

import type { ColorChannel } from '@pyxe/types';

export const channels: Record<string, ColorChannel> = {
    y: { type: 'normalized', min: 0, max: 1, decimals: 3, name: 'Luminance' },
    u: { type: 'numeric', min: -0.436, max: 0.436, decimals: 3, name: 'Blue projection' },
    v: { type: 'numeric', min: -0.615, max: 0.615, decimals: 3, name: 'Red projection' }
};