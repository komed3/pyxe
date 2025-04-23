'use strict';

import type { ColorLibFactory } from '@pyxe/types';
import { Registry } from './Registry.js';

export class ColorLibRegisty extends Registry<string, ColorLibFactory> {

    public add (
        name: string,
        lib: ColorLibFactory
    ) : void {

        super._add( name, lib );

    }

    public remove (
        name: string
    ) : void {

        super._remove( name );

    }

    public clear () : void {

        super._clear();

    }

}

export const colorLibRegisty = new ColorLibRegisty ();