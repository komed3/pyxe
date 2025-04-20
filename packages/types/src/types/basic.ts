'use strict';

export type ColorSpaceID = 'HEX' | 'RGB';

export type HEX = `#${string}`;

export interface RGB {
    r: number;
    g: number;
    b: number;
    a?: number;
}

export type ColorInstance = HEX | RGB;

export type ColorInput = ColorInstance | string;