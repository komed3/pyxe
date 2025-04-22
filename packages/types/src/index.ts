'use strict';

export type ColorSpaceName = 'HEX' | 'RGB';

export interface ColorSpaceFactory {
    name: ColorSpaceName,
    meta?: Record<string, any>
}

export interface ErrorFactory {
    method: string;
    msg?: string;
    err?: Error | string | any;
}