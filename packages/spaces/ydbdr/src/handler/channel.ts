'use strict';

import type { ColorChannel } from '@pyxe/types';

export const channels: Record<string, ColorChannel> = {
    y: { type: 'normalized', min: 0, max: 1, decimals: 3, name: 'Luminance' },
    db: { type: 'numeric', min: -1.333, max: 1.333, decimals: 3, name: 'Blue difference' },
    dr: { type: 'numeric', min: -1.333, max: 1.333, decimals: 3, name: 'Red difference' }
};