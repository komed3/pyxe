'use strict';

import { colorLibRegisty } from '@pyxe/core/colorLib';
import { RAL_Classic } from './colors/classic.js';

colorLibRegisty._register( 'RAL', {
    meta: {
        id: 'RAL',
        name: 'RAL color library',
        description: 'Standardized color list for industrial applications, primarily in Europe.',
        version: '0.1.0',
        license: 'Open Data / RAL® references',
        tags: [ 'standard', 'RAL', 'industry', 'europe' ]
    },
    sources: {
        classic: RAL_Classic
    }
} );