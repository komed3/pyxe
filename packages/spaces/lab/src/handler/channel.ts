'use strict';

import type { ColorChannel } from '@pyxe/types';

export const channels: Record<string, ColorChannel> = {
    l: { type: 'numeric', min:    0, max: 100, decimals: 2, name: 'Lightness' },
    a: { type: 'numeric', min: -128, max: 127, decimals: 2, name: 'Green/Red' },
    b: { type: 'numeric', min: -128, max: 127, decimals: 2, name: 'Blue/Yellow' }
};