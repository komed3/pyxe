'use strict';

import { conversionGraph, type ConversionGraph } from './classes/ConversionGraph.js';
import { test, validator, type Validator } from './classes/Validator.js';

export { Color } from './classes/Color.js';
export { ColorSpace } from './classes/ColorSpace.js';
export { ColorLib } from './classes/ColorLib.js';
export { Module } from './classes/Module.js';
export { Output } from './classes/Output.js';

export const Tools: {
    Graph: ConversionGraph;
    Validate: Validator;
    Test: Validator;
} = {
    Graph: conversionGraph,
    Validate: validator,
    Test: test
};