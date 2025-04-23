'use strict';

import { ColorLibLoader } from '@pyxe/types';
import { colorLibRegisty } from '@pyxe/core/root';

import { RAL_Classic } from './lib/classic.js';
import { RAL_Design } from './lib/design.js';
import { RAL_Effect } from './lib/effect.js';

colorLibRegisty.add( 'RAL', {
    meta: {
        id: 'RAL',
        name: 'RAL color library',
        description: 'Standardized color list for industrial applications, primarily in Europe.',
        version: '0.1.0',
        license: 'Open Data / RAL® references',
        tags: [ 'standard', 'RAL', 'industry', 'europe' ]
    },
    autoLoad: [ 'classic' ],
    sources: {
        classic: RAL_Classic as ColorLibLoader,
        design: RAL_Design as ColorLibLoader,
        effect: RAL_Effect as ColorLibLoader
    }
} );