export type ColorSpaceID = 'HEX' | 'RGB';

export interface ColorSpaceFactory {};

export type ColorInstance = any;

export interface ColorObjectFactory {
    space: ColorSpaceID;
    value: ColorInstance;
    meta?: Record<string, any>
};