'use strict';

import type { ColorChannel } from '@pyxe/types';

export const channels: Record<string, ColorChannel> = {
    y: { type: 'normalized', min: 0, max: 1, decimals: 3, name: 'Luma' },
    pb: { type: 'numeric', min: -0.5, max: 0.5, decimals: 3, name: 'Blue difference' },
    pr: { type: 'numeric', min: -0.5, max: 0.5, decimals: 3, name: 'Red difference' }
};