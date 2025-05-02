'use strict';

import type { ColorSpaceName, ColorObjectFactoryLike } from './ColorSpace.ts';

export type ModuleMethodHandler = (
    input: any,
    options?: Record<string, any>
) => ColorObjectFactoryLike;

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