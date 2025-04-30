'use strict';

import { ColorInstance } from './Color.js';
import { HookHandler } from './Services.js';

export type ColorSpaceName = string;

export interface ColorChannel {
    name: string;
    type: 'normalized' | 'numeric' | 'cyclic' | 'percent';
    min?: number;
    max?: number;
}

export interface ColorObjectFactory {
    space: ColorSpaceName;
    value: ColorInstance;
    alpha?: number;
    meta?: Record<string, any>;
}

export type ConversionHandler = (
    input: ColorObjectFactory
) => ColorObjectFactory | undefined;

export type ConversionFactory = Record<ColorSpaceName, ConversionHandler>;

export type OutputHandler = (
    input: ColorObjectFactory,
    options?: Record<string, any>
) => any;

export type OutputFactory = Record<string, OutputHandler | string>;

export interface ColorSpaceMeta {
    name?: string;
    description?: string;
    [ key: string ] : any;
}

export interface ColorSpaceFactory {
    channels: Record<string, ColorChannel>;
    alpha: boolean;
    aliases?: ColorSpaceName[];
    hooks?: Record<string, HookHandler>;
    conversions?: ConversionFactory;
    output?: OutputFactory;
    meta?: ColorSpaceMeta;
}