'use strict';

import type { ColorSpaceName, ColorSpaceFactory } from '@pyxe/types';
import { Registry } from './Registry.js';

export class ColorSpaceRegistry extends Registry<ColorSpaceName, ColorSpaceFactory> {

    public add (
        name: ColorSpaceName,
        space: ColorSpaceFactory
    ) : void {

        super._add( name, space );

    }

    public remove (
        name: ColorSpaceName
    ) : void {

        super._remove( name );

    }

    public clear () {

        super._clear();

    }

}

export const colorSpaceRegistry = new ColorSpaceRegistry ();