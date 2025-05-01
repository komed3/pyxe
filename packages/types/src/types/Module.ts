'use strict';

import type { ColorSpaceName, ColorObjectFactory } from './ColorSpace.ts';

export type ModuleMethodReturnValue = ColorObjectFactory | ColorObjectFactory[] | any;

export type ModuleMethodHandler = (
    input: any,
    options?: Record<string, any>
) => ModuleMethodReturnValue;

export interface ModuleMethodFactory {
    name: string;
    handler: ModuleMethodHandler;
    spaces: ColorSpaceName[];
    bindAs?: string;
    meta?: Record<string, any>;
}

export interface ModuleFactory {
    methods: ModuleMethodFactory[];
    meta?: Record<string, any>;
}