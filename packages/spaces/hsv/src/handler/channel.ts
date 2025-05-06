'use strict';

import type { ColorChannel } from '@pyxe/types';

export const channels: Record<string, ColorChannel> = {
    h: { type: 'cyclic', min: 0, max: 360, decimals: 0, name: 'Hue' },
    s: { type: 'normalized', min: 0, max: 1, decimals: 3, name: 'Saturation' },
    v: { type: 'normalized', min: 0, max: 1, decimals: 3, name: 'Brightness' }
};