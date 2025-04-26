'use strict';

import type { ColorLibFactory } from '@pyxe/types';
import { Registry } from './Registry.js';
import { hook } from '../services/Hook.js';

export class ColorLibRegisty extends Registry<string, ColorLibFactory> {

    public add (
        name: string,
        lib: ColorLibFactory
    ) : void {

        hook.run( 'ColorLibRegisty::beforeAdd', name, lib, this );

        super._add( name, lib );

        hook.run( 'ColorLibRegisty::afterAdd', name, lib, this );

    }

    public remove (
        name: string
    ) : void {

        hook.run( 'ColorLibRegisty::beforeRemove', name, this );

        super._remove( name );

        hook.run( 'ColorLibRegisty::afterRemove', name, this );

    }

    public clear () : void {

        hook.run( 'ColorLibRegisty::clear', this );

        super._clear();

    }

}

export const colorLibRegisty = new ColorLibRegisty ();