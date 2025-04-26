'use strict';

import type { ColorInstance } from './Color.js';
import type { ColorSpaceName } from './ColorSpace.js';

export interface ColorLibMeta {
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
    spaces: Record<ColorSpaceName, ColorInstance>;
    meta?: Record<string, any>;
}

export type ColorLibList = ColorLibEntry[];

export type ColorLibLoader = () => Promise<ColorLibList>;

export interface ColorLibFactory {
    meta: ColorLibMeta;
    sources: Record<string, ColorLibLoader>;
    autoLoad?: string[];
}