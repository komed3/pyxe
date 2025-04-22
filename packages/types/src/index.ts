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