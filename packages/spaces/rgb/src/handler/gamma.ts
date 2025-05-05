'use strict';

import type { GammaFactory } from '@pyxe/types';

export const gamma: GammaFactory = {
    encode: ( val: number ) : number => val,
    decode: ( val: number ) : number => val
};