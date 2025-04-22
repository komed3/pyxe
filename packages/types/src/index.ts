'use strict';

export type ColorSpaceName = 'HEX' | 'RGB';

export interface ColorSpaceFactory {
    name: ColorSpaceName,
    meta?: Record<string, any>
}