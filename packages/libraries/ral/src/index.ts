'use strict';

import type { ColorLibLoader } from '@pyxe/types';
import { Registry } from '@pyxe/core/registry';
import { RAL_Classic } from './lib/classic.js';
import { RAL_DESIGN } from './lib/design.js';
import { RAL_Effect } from './lib/effect.js';

Registry.ColorLib.add( 'ral', {
    meta: {
        name: 'RAL color library',
        description: 'Standardized color list for industrial applications, primarily in Europe.',
        version: '0.1.0',
        license: 'Open Data / RAL® references',
        tags: [ 'standard', 'RAL', 'industry', 'europe' ]
    },
    autoLoad: [ 'classic' ],
    sources: {
        classic: RAL_Classic as ColorLibLoader,
        design: RAL_DESIGN as ColorLibLoader,
        effect: RAL_Effect as ColorLibLoader
    }
} );