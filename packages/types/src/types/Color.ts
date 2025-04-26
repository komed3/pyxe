'use strict';

export interface RGB {
    r: number; g: number; b: number;
}

export interface HSL {
    h: number; s: number; l: number;
}

export interface HSV {
    h: number; s: number; v: number;
}

export interface Lab {
    L: number; a: number; b: number;
}

export interface LCh {
    L: number; C: number; h: number;
}

export interface CMYK {
    c: number; m: number; y: number; k: number;
}

export type ColorInstance = RGB | HSL | HSV | Lab | LCh | CMYK;

export type ColorInput = ColorInstance | string;