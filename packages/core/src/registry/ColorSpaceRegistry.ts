'use strict';

import type { ColorSpaceName, ColorSpaceFactory } from '@pyxe/types';
import { Registry } from './Registry.js';
import { conversionGraphRegistry } from './ConversionGraphRegistry.js';

export class ColorSpaceRegistry extends Registry<ColorSpaceName, ColorSpaceFactory> {

    public add (
        name: ColorSpaceName,
        factory: ColorSpaceFactory
    ) : void {

        super._add( name, factory );

        if ( factory.conversions ) {

            conversionGraphRegistry.addMany( name, factory.conversions );

        }

    }

    public remove (
        name: ColorSpaceName
    ) : void {

        conversionGraphRegistry.removeAll( name );

        super._remove( name );

    }

    public clear () {

        conversionGraphRegistry.clear();

        super._clear();

    }

}

export const colorSpaceRegistry = new ColorSpaceRegistry ();