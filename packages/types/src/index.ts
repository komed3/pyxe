'use strict';

export type ColorSpaceID = 'HEX' | 'RGB' | 'HSL' | 'HSV' | 'CMYK' | 'XYZ' | 'Lab' | 'HLC';

export type HEX = `#${string}`;

export interface RGB {
    r: number;
    g: number;
    b: number;
    a?: number;
}

export interface HSL {
    h: number;
    s: number;
    l: number;
}

export interface HSV {
    h: number;
    s: number;
    v: number;
}

export interface CMYK {
    c: number;
    m: number;
    y: number;
    k: number;
}

export interface XYZ {
    x: number;
    y: number;
    z: number;
}

export interface Lab {
    L: number;
    a: number;
    b: number;
}

export interface HLC {
    h: number;
    l: number;
    c: number;
}

export type ColorInstance = HEX | RGB | HSL | HSV | CMYK | XYZ | Lab | HLC;

export type ColorInput = ColorInstance | string;

export interface ColorObject {
    space: ColorSpaceID;
    value: ColorInstance;
    meta?: Record<string, any>;
};

export type OutputTypes = 'string' | 'json' | string;

export type OutputHandler = (
    input: ColorObject,
    options?: Record<string, any>
) => string | unknown;

export type ParserHandler = (
    input: ColorInput
) => ColorObject | undefined;

export type ValidatorHandler = (
    input: ColorObject
) => boolean;

export type ConversionHandler = (
    input: ColorObject | undefined
) => ColorObject | undefined;

export interface ConversionPath {
    target: ColorSpaceID;
    handler: ConversionHandler;
}

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
    id: ColorSpaceID;
    validator: ValidatorHandler;
    parser: ParserHandler;
    conversions?: ConversionPath[];
    output?: Record<OutputTypes, OutputHandler>;
    meta?: ColorSpaceMeta
}

export type ModuleMethodHandler = (
    input: ColorObject,
    ...args: any[]
) => ColorObject | ColorObject[] | any;

export interface ModuleMethodFactory {
    id: string;
    handler: ModuleMethodHandler;
    spaces: ColorSpaceID[];
    bindAs?: string;
    meta?: Record<string, any>
}

export interface ModuleFactory {
    id: string;
    methods: ModuleMethodFactory[],
    meta?: Record<string, any>
}

export interface ErrorFactory {
    method: string;
    msg?: string;
    err?: Error | string | any;
}

export interface TracerFactory {
    action: string;
    timestamp: Date | number;
    meta?: {
        input?: ColorObject | unknown;
        result?: ColorObject | unknown;
        [ key: string ] : any;
    };
}

export interface ColorLibMeta {
    id: string;
    name?: string;
    description?: string;
    version?: string;
    author?: string;
    license?: string;
    tags?: string[];
}

export interface ColorLibEntry {
    id: string;
    name?: string | Record<string, string>;
    spaces: Partial<Record<ColorSpaceID, ColorInstance>>;
    meta?: Record<string, any>;
}

export type ColorLibList = ColorLibEntry[];

export type ColorLibLoader = () => Promise<ColorLibList>;

export interface ColorLibFactory {
    meta: ColorLibMeta;
    autoLoad?: string[];
    sources: Record<string, ColorLibLoader>;
}

export type HookHandler = (
    ...args: any[]
) => any;

export interface HookFactory {
    handler: HookHandler;
    priority: number;
    once?: boolean;
}