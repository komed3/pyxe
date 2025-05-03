'use strict';

import type { GammaHandler } from '@pyxe/types';

export const gamma: GammaHandler = {
    encode: ( val: number ) : number => val,
    decode: ( val: number ) : number => val
};