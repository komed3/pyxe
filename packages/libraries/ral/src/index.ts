/**
 * The RAL Color Library
 * @pyxe/library-ral
 * 
 * The RAL color system is a standardized framework for identifying and communicating
 * colors, originally developed in 1927 by the German RAL (Reichsausschuss für
 * Lieferbedingungen) authority.
 * 
 * Today, RAL defines a comprehensive palette of colors used globally in architecture,
 * design, manufacturing, and various industrial applications. This modular system
 * simplifies color specification and ensures consistency across different materials,
 * surfaces, and production methods. With unique numerical codes and names, RAL colors
 * facilitate precise color matching, quality control, and international trade standards.
 * 
 * This library supports multiple RAL collections, each grouped by function and context
 * of use. The initial release includes:
 * 
 *   - RAL Classic: The original and most widely used industrial standard
 *   - RAL Effect:  A more recent system with metallic and nuanced shades
 *   - RAL Design:  A color space-oriented catalog built for design and
 *                  architecture professionals
 * 
 * “RAL” is a registered trademark of RAL gemeinnützige GmbH.
 * This library is not affiliated with or endorsed by RAL GmbH.
 * 
 * @requires @pyxe/core
 * @requires @pyxe/types
 * 
 * @author Paul Köhler (komed3)
 * @license MIT
 * @version 0.1.0
 */

'use strict';

import { colorLibRegisty } from '@pyxe/core/root';
import type { ColorLibLoader } from '@pyxe/types';

import { RAL_Classic } from './lib/classic.js';
import { RAL_Design } from './lib/design.js';
import { RAL_Effect } from './lib/effect.js';

colorLibRegisty.add( 'RAL', {
    name: 'RAL',
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