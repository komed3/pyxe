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

export interface HSI {
    h: number; s: number; i: number;
}

export interface XYZ {
    x: number; y: number; z: number;
}

export interface xyY {
    x: number; y: number; Y: number;
}

export interface Yxy {
    Y: number; x: number; y: number;
}

export interface Lab {
    l: number; a: number; b: number;
}

export interface LCh {
    l: number; c: number; h: number;
}

export interface CMYK {
    c: number; m: number; y: number; k: number;
}

export type ColorInstance = RGB | HSL | HSV | HSI | XYZ | xyY | Yxy | Lab | LCh | CMYK;

export type ColorInput = ColorInstance | string;