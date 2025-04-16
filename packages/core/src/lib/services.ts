'use strict';

import { colorSpace } from './colorSpace.js';
import { conversionGraph } from './graph.js';

export { Parser } from './parser.js';
export { Validator } from './validator.js';

export const Services = {
    getSpaces: colorSpace.getSpaces,
    hasSpace: colorSpace.has,
    getSpaceMeta: colorSpace.getMeta,
    describePath: conversionGraph.describePath,
    tree: conversionGraph.tree
};