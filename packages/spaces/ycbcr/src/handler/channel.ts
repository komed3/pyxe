'use strict';

import type { ColorChannel } from '@pyxe/types';

export const channels: Record<string, ColorChannel> = {
    y: { type: 'numeric', min: 16, max: 235, decimals: 0, name: 'Luma' },
    cb: { type: 'numeric', min: 16, max: 240, decimals: 0, name: 'Blue chroma' },
    cr: { type: 'numeric', min: 16, max: 240, decimals: 0, name: 'Red chroma' }
};