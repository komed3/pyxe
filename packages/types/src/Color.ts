'use strict';

export type HEX = `#${string}`;

export interface RGB {
    r: number; g: number; b: number; a?: number;
}

export interface HSL {
    h: number; s: number; l: number; a?: number;
}

export interface HSV {
    h: number; s: number; v: number; a?: number;
}

export type ColorInstance = HEX | RGB | HSL | HSV;

export type ColorInput = ColorInstance | string;