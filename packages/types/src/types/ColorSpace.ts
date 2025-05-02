'use strict';

import { ColorInstance } from './Color.js';
import { HookHandler } from './Services.js';

export type ColorSpaceName = string;

export interface ColorChannel {
    name: string;
    type: 'normalized' | 'numeric' | 'cyclic' | 'percent';
    min?: number;
    max?: number;
    decimals?: number;
}

export interface ColorObjectFactory {
    space: ColorSpaceName;
    value: ColorInstance;
    alpha?: number;
    meta?: Record<string, any>;
}

export type ColorObjectFactoryLike = ColorObjectFactory | ColorObjectFactory[] | any;

export type ConversionHandler = (
    input: ColorObjectFactory
) => ColorObjectFactory | undefined;

export type ConversionFactory = Record<ColorSpaceName, ConversionHandler>;

export interface OutputOptions {
    format?: 'auto' | 'percent' | 'normalized';
    forceAlpha?: boolean;
    decimals?: number;
    unit?: string;
    schema?: string;
}

export type OutputHandler = (
    input: ColorObjectFactory,
    options?: OutputOptions
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