'use strict';

import { colorSpace } from './lib/colorSpace.js';
import { module } from './lib/module.js';
import { conversionGraph } from './lib/graph.js';
import { colorLibRegisty } from './lib/colorLib.js';

export { Parser } from './lib/parser.js';
export { Validator } from './lib/validator.js';
export { Output } from './lib/output.js';
export { ColorLib } from './lib/colorLib.js';

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