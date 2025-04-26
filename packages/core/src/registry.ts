'use strict';

import { colorSpaceRegistry } from './registry/ColorSpaceRegistry.js';
import { colorLibRegisty } from './registry/ColorLibRegistry.js';
import { ColorMethodRegistry } from './registry/ColorMethodRegistry.js';
import { moduleRegistry } from './registry/ModuleRegistry.js';
import { moduleMethodRegistry } from './registry/ModuleMethodRegistry.js';

export const registry = {
    ColorSpace: colorSpaceRegistry,
    ColorLib: colorLibRegisty,
    ColorMethod: ColorMethodRegistry,
    Module: moduleRegistry,
    ModuleMethod: moduleMethodRegistry
}