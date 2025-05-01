'use strict';

import { colorSpaceRegistry, type ColorSpaceRegistry } from './registries/ColorSpaceRegistry.js';
import { moduleRegistry, type ModuleRegistry } from './registries/ModuleRegistry.js';
import { outputRegistry, type OutputRegistry } from './registries/OutputRegistry.js';
import { colorLibRegistry, type ColorLibRegistry } from './registries/ColorLibRegistry.js';
import { ColorMethodRegistry } from './registries/ColorMethodRegistry.js';

export const Registry: {
    ColorSpace: ColorSpaceRegistry,
    Module: ModuleRegistry,
    Output: OutputRegistry,
    ColorLib: ColorLibRegistry,
    ColorMethod: typeof ColorMethodRegistry
} = {
    ColorSpace: colorSpaceRegistry,
    Module: moduleRegistry,
    Output: outputRegistry,
    ColorLib: colorLibRegistry,
    ColorMethod: ColorMethodRegistry
};