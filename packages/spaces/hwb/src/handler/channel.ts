'use strict';

import type { ColorChannel } from '@pyxe/types';

export const channels: Record<string, ColorChannel> = {
    h: { type: 'cyclic', min: 0, max: 360, decimals: 0, name: 'Hue' },
    w: { type: 'percent', min: 0, max: 100, decimals: 0, name: 'Whiteness' },
    b: { type: 'percent', min: 0, max: 100, decimals: 0, name: 'Blackness' }
};