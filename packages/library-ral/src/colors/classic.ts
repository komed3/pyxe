'use strict';

import type { ColorLibList } from '@pyxe/types';

export const RAL_Classic = async () : Promise<ColorLibList> => [ {
    id: 'RAL 1000',
    name: {
        en: 'Green beige',
        de: 'Grünbeige'
    },
    spaces: {
        HEX: '#cdba88',
        RGB: { r: 205, g: 186, b: 136 }
    }
} ];