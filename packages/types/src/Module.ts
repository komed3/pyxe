'use strict';

import type { ColorSpaceName } from './ColorSpace.ts';

export type ModuleMethodHandler = (
    input: any,
    options?: Record<string, any>
) => any;

export interface ModuleMethodFactory {
    name: string;
    handler: ModuleMethodHandler;
    spaces: ColorSpaceName[];
    bindAs?: string;
    meta?: Record<string, any>;
}

export interface ModuleFactory {
    name: string;
    methods: ModuleMethodFactory[];
    meta?: Record<string, any>;
}