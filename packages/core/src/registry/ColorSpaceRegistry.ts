'use strict';

import type { ColorSpaceName, ColorSpaceFactory } from '@pyxe/types';
import { Registry } from './Registry.js';
import { PyxeError } from '../services/PyxeError.js';
import { hook } from '../services/Hook.js';

export class ColorSpaceRegistry extends Registry<ColorSpaceName, ColorSpaceFactory> {

    protected aliases: Map<ColorSpaceName, ColorSpaceName> = new Map ();

    public sanitize (
        name: ColorSpaceName
    ) : ColorSpaceName {

        return hook.filter( 'ColorSpaceRegistry::sanitize', super.sanitize(
            this.aliases.get( name ) ?? name
        ), name, this );

    }

    public add (
        name: ColorSpaceName,
        factory: ColorSpaceFactory
    ) : void {

        const sanitized = this.sanitize( name );

        hook.run( 'ColorSpaceRegistry::beforeAdd', name, sanitized, factory, this );

        super.add( sanitized, factory );

        if ( factory.aliases ) {

            for ( const alias of factory.aliases ) {

                if ( this.has( alias ) || this.aliases.has( alias ) ) {

                    throw new PyxeError ( {
                        method: 'ColorSpaceRegistry',
                        msg: `Alias <${alias}> is already declared for <${ this.sanitize( alias ) }>`
                    } );

                }

                this.aliases.set( alias, sanitized );

            }

        }

        if ( factory.hooks ) {

            for ( const [ key, handler ] of Object.entries( factory.hooks ) ) {

                hook.add( key, handler );

            }

        }

        hook.run( 'ColorSpaceRegistry::afterAdd', name, sanitized, factory, this );

    }

    public remove (
        name: ColorSpaceName
    ) : void {

        const sanitized = this.sanitize( name ),
              factory = this.get( sanitized );

        hook.run( 'ColorSpaceRegistry::beforeRemove', name, sanitized, this );

        super.remove( sanitized );

        if ( factory?.aliases ) {

            for ( const alias of factory.aliases ) {

                this.aliases.delete( alias );

            }

        }

        if ( factory?.hooks ) {

            for ( const [ key, handler ] of Object.entries( factory.hooks ) ) {

                hook.remove( key, handler );

            }

        }

        hook.run( 'ColorSpaceRegistry::afterRemove', name, sanitized, this );

    }

    public clear () {

        hook.run( 'ColorSpaceRegistry::clear', this );

        for ( const name of this.list() ) {

            this.remove( name );

        }

    }

    public has (
        name: ColorSpaceName,
        safe: boolean = false
    ) : boolean {

        return super.has( this.sanitize( name ), safe );

    }

    public get (
        name: ColorSpaceName,
        safe: boolean = true
    ) : ColorSpaceFactory | undefined {

        return super.get( this.sanitize( name ), safe );

    }

}

export const colorSpaceRegistry = new ColorSpaceRegistry ();