'use strict';

import type { ColorSpaceName, OutputFactory, OutputHandler } from '@pyxe/types';
import { Registry } from './Registry.js';
import { hook } from '../services/Hook.js';

export class OutputRegistry extends Registry<ColorSpaceName, OutputFactory> {

    public add (
        space: ColorSpaceName,
        type: string,
        handler: OutputHandler | string
    ) : void {

        hook.run( 'OutputRegistry::beforeAdd', space, type, handler, this );

        if ( ! this.has( space ) ) {

            this.items.set( space, {} );

        }

        this.items.get( space )![ type ] = handler;

        hook.run( 'OutputRegistry::afterAdd', space, type, handler, this );

    }

    public addMany (
        space: ColorSpaceName,
        factory: OutputFactory
    ) : void {

        hook.run( 'OutputRegistry::addMany', space, factory, this );

        for ( const [ type, handler ] of Object.entries( factory ) ) {

            this.add( space, type, handler );

        }

    }

}

export const outputRegistry = new OutputRegistry ();