'use strict';

import type { ColorChannel } from '@pyxe/types';

export const channels: Record<string, ColorChannel> = {
    Y: { type: 'numeric', min: 0, max: 100, decimals: 2, name: 'Relative luminance' },
    x: { type: 'normalized', min: 0, max: 1, decimals: 4, name: 'x chromaticity' },
    y: { type: 'normalized', min: 0, max: 1, decimals: 4, name: 'y chromaticity' }
};