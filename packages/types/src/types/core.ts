'use strict';

import type { ColorSpaceID, ColorInstance, ColorInput } from './basic.js';

export interface ColorObjectFactory {
    space: ColorSpaceID;
    value: ColorInstance;
    meta?: Record<string, any>;
}

export interface ColorChannelMeta {
    name: string;
    range: [ number, number ];
    unit?: string;
    description?: string;
}

export type ValidatorHandler = (
    input: ColorObjectFactory
) => boolean;

export type ParserHandler = (
    input: ColorInput
) => ColorObjectFactory | undefined;

export type ConversionHandler = (
    input: ColorObjectFactory | undefined
) => ColorObjectFactory | undefined;

export type ConversionFactory = Partial<Record<ColorSpaceID, ConversionHandler>>;

export type OutputTypes = 'string' | 'json' | string;

export type OutputHandler = (
    input: ColorObjectFactory,
    options?: Record<string, any>
) => string | unknown;

export type OutputFactory = Partial<Record<OutputTypes, OutputHandler>>;

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
    id: ColorSpaceID;
    validator: ValidatorHandler;
    parser: ParserHandler;
    conversions?: unknown;
    output?: OutputFactory;
    meta?: ColorSpaceMeta;
}