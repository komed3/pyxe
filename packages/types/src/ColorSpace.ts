'use strict';

import type { ColorInstance, ColorInput } from './Color.js';

export type ColorSpaceName = 'HEX' | 'RGB' | 'HSL' | 'HSV' | 'Lab' | 'CMYK';

export interface ColorObjectFactory {
    space: ColorSpaceName;
    value: ColorInstance;
    meta?: Record<string, any>;
}

export type ValidatorHandler = (
    input: ColorObjectFactory
) => boolean;

export type ParserHandler = (
    input: ColorInput
) => ColorObjectFactory | undefined;

export type ConversionHandler = (
    input: ColorObjectFactory
) => ColorObjectFactory | undefined;

export type ConversionFactory = Partial<Record<ColorSpaceName, ConversionHandler>>;

export type OutputTypes = 'string' | 'json' | string;

export type OutputHandler = (
    input: ColorObjectFactory,
    options?: Record<string, any>
) => string | unknown;

export type OutputFactory = Partial<Record<OutputTypes, OutputHandler>>;

export interface ColorChannelMeta {
    name: string;
    range: [ number, number ];
    unit?: string;
    description?: string;
}

export interface ColorSpaceMeta {
    name: string;
    description?: string;
    type: 'numeric' | 'encoded' | 'perceptual' | string;
    channels: Record<string, ColorChannelMeta>;
    alpha?: boolean;
    spaces?: string[];
    output?: string[];
    cssSupport?: boolean;
}

export interface ColorSpaceFactory {
    name: ColorSpaceName;
    validator: ValidatorHandler;
    parser: ParserHandler;
    conversions: ConversionFactory;
    output?: OutputFactory;
    meta?: ColorSpaceMeta;
}