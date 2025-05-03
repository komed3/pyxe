'use strict';

import { Registry } from '@pyxe/core/registry';

Registry.ColorLib.add( 'ral', {
    meta: {
        name: 'RAL color library',
        description: 'Standardized color list for industrial applications, primarily in Europe.',
        version: '0.1.0',
        license: 'Open Data / RAL® references',
        tags: [ 'standard', 'RAL', 'industry', 'europe' ]
    },
    autoLoad: [ 'classic' ],
    sources: {}
} );