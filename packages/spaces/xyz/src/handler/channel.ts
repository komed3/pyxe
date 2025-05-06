'use strict';

import type { ColorChannel } from '@pyxe/types';

export const channels: Record<string, ColorChannel> = {
    x: { type: 'numeric', min: 0, max:  95.047, decimals: 3, name: 'X' },
    y: { type: 'numeric', min: 0, max: 100.000, decimals: 3, name: 'Y' },
    z: { type: 'numeric', min: 0, max: 108.883, decimals: 3, name: 'Z' }
};
