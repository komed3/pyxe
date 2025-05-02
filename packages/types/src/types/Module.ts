'use strict';

import type { ColorSpaceName, ColorObjectLike } from './ColorSpace.ts';

export type ModuleMethodHandler = (
    input: any,
    options?: Record<string, any>
) => ColorObjectLike;

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