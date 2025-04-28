'use strict';

import type { ColorInstance } from './Color.js';
import type { ColorSpaceName } from './ColorSpace.js';

export interface ColorLibEntry {
    id: string;
    name?: string | Record<string, string>;
    spaces: Record<ColorSpaceName, ColorInstance>;
    alpha?: number;
    meta?: Record<string, any>;
}

export type ColorLibList = ColorLibEntry[];

export type ColorLibLoader = () => Promise<ColorLibList>;

export interface ColorLibMeta {
    name?: string;
    description?: string;
    version?: string;
    author?: string;
    license?: string;
    tags?: string[];
}

export interface ColorLibFactory {
    sources: Record<string, ColorLibLoader>;
    meta: ColorLibMeta;
    autoLoad?: string[];
}