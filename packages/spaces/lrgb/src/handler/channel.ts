'use strict';

import type { ColorChannel } from '@pyxe/types';

export const channels: Record<string, ColorChannel> = {
    r: { type: 'numeric', min: 0, max: 255, decimals: 0, name: 'Red' },
    g: { type: 'numeric', min: 0, max: 255, decimals: 0, name: 'Green' },
    b: { type: 'numeric', min: 0, max: 255, decimals: 0, name: 'Blue' }
};