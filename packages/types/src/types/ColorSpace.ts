'use strict';

import { ColorInstance } from './Color.js';
import { HookHandler } from './Services.js';

export type ColorSpaceName = string;

export interface ColorChannel {
    name: string;
    type: 'numeric' | 'cyclic' | 'normalized';
    min?: number;
    max?: number;
}

export interface ColorObjectFactory {
    space: ColorSpaceName;
    value: ColorInstance;
    meta?: Record<string, any>;
}

export type ConversionHandler = (
    input: ColorObjectFactory
) => ColorObjectFactory | undefined;

export type ConversionFactory = Record<ColorSpaceName, ConversionHandler>;

export interface ColorSpaceMeta {
    name?: string;
    description?: string;
}

export interface ColorSpaceFactory {
    channels: Record<string, ColorChannel>;
    alpha: boolean;
    aliases?: ColorSpaceName[];
    hooks?: Record<string, HookHandler>;
    conversions?: ConversionFactory;
    output?: [];
    meta?: ColorSpaceMeta;
}