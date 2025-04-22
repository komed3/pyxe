'use strict';

export type ColorSpaceName = 'HEX' | 'RGB';

export type HEX = `#${string}`;

export interface RGB {
    r: number;
    g: number;
    b: number;
    a?: number;
}

export type ColorInstance = HEX | RGB;

export type ColorInput = ColorInstance | string;

export type ConversionHandler = (
    input: any
) => any;

export type ConversionFactory = Partial<Record<ColorSpaceName, ConversionHandler>>;

export interface ColorSpaceFactory {
    name: ColorSpaceName,
    conversions: ConversionFactory;
    meta?: Record<string, any>
}

export interface ErrorFactory {
    method: string;
    msg?: string;
    err?: Error | string | any;
}

export type ModuleMethodHandler = (
    input: any,
    options?: Record<string, any>
) => any;

export interface ModuleMethodFactory {
    id: string;
    handler: ModuleMethodHandler;
    spaces: ColorSpaceName[];
    bindAs?: string;
    meta?: Record<string, any>;
}

export interface ModuleFactory {
    id: string;
    methods: ModuleMethodFactory[];
    meta?: Record<string, any>;
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
    spaces: Partial<Record<ColorSpaceName, ColorInstance>>;
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

export interface TracerFactory {
    action: string;
    timestamp: Date | number;
    meta?: {
        input?: any;
        result?: any;
        [ key: string ] : any;
    };
}