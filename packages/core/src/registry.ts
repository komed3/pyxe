'use strict';

import { colorSpaceRegistry, type ColorSpaceRegistry } from './registries/ColorSpaceRegistry.js';
import { moduleRegistry, type ModuleRegistry } from './registries/ModuleRegistry.js';
import { colorLibRegistry, type ColorLibRegistry } from './registries/ColorLibRegistry.js';
import { ColorMethodRegistry } from './registries/ColorMethodRegistry.js';

export const registry: {
    ColorSpace: ColorSpaceRegistry,
    Module: ModuleRegistry,
    ColorLib: ColorLibRegistry,
    ColorMethod: typeof ColorMethodRegistry
} = {
    ColorSpace: colorSpaceRegistry,
    Module: moduleRegistry,
    ColorLib: colorLibRegistry,
    ColorMethod: ColorMethodRegistry
};