'use strict';

import type { ColorSpaceName, ColorSpaceFactory } from '@pyxe/types';
import { Registry } from './Registry.js';

export class ColorSpaceRegistry extends Registry<ColorSpaceName, ColorSpaceFactory> {

    public add (
        key: ColorSpaceName,
        factory: ColorSpaceFactory
    ) : void {

        super._add( key, factory );

    }

    public remove (
        key: ColorSpaceName
    ) : void {

        super._remove( key );

    }

    public clear () {

        super._clear();

    }

}

export const colorSpaceRegistry = new ColorSpaceRegistry ();