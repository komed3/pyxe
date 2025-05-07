'use strict';

import type { ColorChannel } from '@pyxe/types';

export const channels: Record<string, ColorChannel> = {
    l: { type: 'normalized', min: 0, max: 1, decimals: 4, name: 'Long' },
    m: { type: 'normalized', min: 0, max: 1, decimals: 4, name: 'Medium' },
    s: { type: 'normalized', min: 0, max: 1, decimals: 4, name: 'Short' }
};