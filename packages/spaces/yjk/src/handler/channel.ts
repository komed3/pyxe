'use strict';

import type { ColorChannel } from '@pyxe/types';

export const channels: Record<string, ColorChannel> = {
    y: { type: 'numeric', min:    0, max: 255, decimals: 0, name: 'Luma' },
    j: { type: 'numeric', min: -128, max: 127, decimals: 0, name: 'Red chroma difference' },
    k: { type: 'numeric', min: -128, max: 127, decimals: 0, name: 'Green chroma difference' }
};