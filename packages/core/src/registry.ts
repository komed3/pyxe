'use strict';

import { ColorMethodRegistry } from './registry/ColorMethodRegistry.js';
import { colorSpaceRegistry } from './registry/ColorSpaceRegistry.js';
import { moduleMethodRegistry } from './registry/ModuleMethodRegistry.js';
import { moduleRegistry } from './registry/ModuleRegistry.js';
import { colorLibRegistry } from './registry/ColorLibRegistry.js';

export const registry = {
    ColorMethod: ColorMethodRegistry,
    ColorSpace: colorSpaceRegistry,
    ModuleMethod: moduleMethodRegistry,
    Module: moduleRegistry,
    ColorLib: colorLibRegistry
}