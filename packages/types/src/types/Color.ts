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

export interface HWB {
    h: number; w: number; b: number;
}

export interface HCG {
    h: number; c: number; g: number;
}

export interface XYZ {
    x: number; y: number; z: number;
}

export interface xyY {
    x: number; y: number; Y: number;
}

export interface Lab {
    l: number; a: number; b: number;
}

export interface LMS {
    l: number; m: number; s: number;
}

export interface LCh {
    l: number; c: number; h: number;
}

export interface CMY {
    c: number; m: number; y: number;
}

export interface CMYK {
    c: number; m: number; y: number; k: number;
}

export type ColorInstance =
    | RGB | HSL | HSV | HSI | HWB | HCG | XYZ | xyY | Lab | LMS
    | LCh | CMY | CMYK;

export type ColorInput = ColorInstance | string;