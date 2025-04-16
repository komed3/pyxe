'use strict';

import { colorSpace } from './colorSpace.js';
import { module } from './module.js';
import { conversionGraph } from './graph.js';
import { colorLibRegisty } from './colorLib.js';

export { Parser } from './parser.js';
export { Validator } from './validator.js';
export { Output } from './output.js';
export { ColorLib } from './colorLib.js';

export const Services = {

    colorSpace: {
        list: colorSpace.getSpaces,
        has: colorSpace.has,
        meta: colorSpace.getMeta
    },

    module: {
        list: module.getModules,
        has: module.has,
        meta: module.getMeta
    },

    colorLib: {
        list: colorLibRegisty.getLibraries,
        has: colorLibRegisty.has,
        meta: colorLibRegisty.getMeta
    },

    conversionGraph: {
        describePath: conversionGraph.describePath,
        tree: conversionGraph.tree
    }

};