'use strict';

import { ColorSpaceID } from '@pyxe/types';

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
        list: () => colorSpace.getSpaces(),
        has: ( id: ColorSpaceID ) => colorSpace.has( id ),
        meta: ( id: ColorSpaceID ) => colorSpace.getMeta( id )
    },

    module: {
        list: () => module.getModules(),
        has: ( id: string ) => module.has( id ),
        meta: ( id: string ) => module.getMeta( id )
    },

    colorLib: {
        list: () => colorLibRegisty.getLibraries(),
        has: ( id: string ) => colorLibRegisty.has( id ),
        meta: ( id: string ) => colorLibRegisty.getMeta( id )
    },

    conversionGraph: {
        describePath: ( source: ColorSpaceID, target: ColorSpaceID ) => conversionGraph.describePath( source, target ),
        tree: ( root: ColorSpaceID, maxDepth: number = 99 ) => conversionGraph.tree( root, maxDepth )
    }

};