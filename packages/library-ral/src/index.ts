/**
 * The RAL Color Library
 * @pyxe/library-ral
 * 
 * The RAL Color Library is a modular collection of standardized color systems used
 * primarily in industrial and architectural design across Europe. It serves as a
 * canonical reference for color identification, communication, and quality control.
 * Each submodule represents a distinct RAL color catalog and integrates seamlessly
 * with the pyxe color framework.
 * 
 * This library supports multiple RAL collections, each grouped by function and
 * context of use. The initial release includes:
 * 
 *   - RAL Classic: The original and most widely used industrial standard
 *   - RAL Effect: A more recent system with metallic and nuanced shades
 *   - RAL Design: A color space-oriented catalog built for design and
 *                 architecture professionals
 * 
 * All color entries are provided in normalized format and support multiple color
 * spaces where applicable.
 * 
 * @requires @pyxe/core
 * @requires @pyxe/types
 * 
 * @author Paul Köhler (komed3)
 * @license MIT
 * @version 0.1.0
 */

'use strict';

import { _ColorLib } from '@pyxe/core/dev';

import { RAL_Classic } from './colors/classic.js';
import { RAL_Design } from './colors/design.js';
import { RAL_Effect } from './colors/effect.js';

_ColorLib.colorLibRegisty._register( 'RAL', {
    meta: {
        id: 'RAL',
        name: 'RAL color library',
        description: 'Standardized color list for industrial applications, primarily in Europe.',
        version: '0.1.0',
        license: 'Open Data / RAL® references',
        tags: [ 'standard', 'RAL', 'industry', 'europe' ]
    },
    sources: {
        classic: RAL_Classic,
        design: RAL_Design,
        effect: RAL_Effect
    }
} );