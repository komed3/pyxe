'use strict';

import type { ColorChannel } from '@pyxe/types';

export const channels: Record<string, ColorChannel> = {
    c: { type: 'numeric', min: 0, max: 100, decimals: 2, name: 'Cyan' },
    m: { type: 'numeric', min: 0, max: 100, decimals: 2, name: 'Magenta' },
    y: { type: 'numeric', min: 0, max: 100, decimals: 2, name: 'Yellow' },
    k: { type: 'numeric', min: 0, max: 100, decimals: 2, name: 'Key' }
};