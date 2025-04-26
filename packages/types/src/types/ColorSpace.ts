'use strict';

import { ColorChannel } from './Color.js';
import { HookHandler } from './Services.js';

export type ColorSpaceName = string;

export interface ColorSpaceMeta {
    name?: string;
    description?: string;
}

export interface ColorSpaceFactory {
    channels: Record<string, ColorChannel>;
    alpha: boolean;
    aliases?: ColorSpaceName[];
    hooks?: Record<string, HookHandler>;
    conversions?: [];
    output?: [];
    meta?: ColorSpaceMeta;
}