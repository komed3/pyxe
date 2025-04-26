'use strict';

import type { ColorSpaceName, ColorSpaceFactory } from '@pyxe/types';
import { Registry } from './Registry.js';
import { conversionGraphRegistry } from './ConversionGraphRegistry.js';
import { PyxeError } from '../services/PyxeError.js';
import { hook } from '../services/Hook.js';

export class ColorSpaceRegistry extends Registry<ColorSpaceName, ColorSpaceFactory> {

    protected aliases: Map<ColorSpaceName, ColorSpaceName> = new Map ();

    public resolve (
        name: ColorSpaceName
    ) : ColorSpaceName {

        const sanitized = super._sanitize( name );

        return hook.filter( 'ColorSpaceRegistry::sanitize', (
            this.aliases.get( sanitized ) ?? sanitized
        ), name, this );

    }

    public add (
        name: ColorSpaceName,
        factory: ColorSpaceFactory
    ) : void {

        hook.run( 'ColorSpaceRegistry::beforeAdd', name, name, factory, this );

        super._add( name, factory );

        if ( factory.aliases ) {

            for ( const alias of factory.aliases ) {

                if ( this.has( alias ) || this.aliases.has( alias ) ) {

                    throw new PyxeError ( {
                        method: 'ColorSpaceRegistry',
                        msg: `Alias <${alias}> is already declared for <${ this.resolve( alias ) }>`
                    } );

                }

                this.aliases.set( alias, name );

            }

        }

        if ( factory.hooks ) {

            for ( const [ key, handler ] of Object.entries( factory.hooks ) ) {

                hook.add( key, handler );

            }

        }

        if ( factory.conversions ) {

            conversionGraphRegistry.addMany( name, factory.conversions );

        }

        hook.run( 'ColorSpaceRegistry::afterAdd', name, name, factory, this );

    }

    public remove (
        name: ColorSpaceName
    ) : void {

        const factory = this.get( name );

        hook.run( 'ColorSpaceRegistry::beforeRemove', name, name, this );

        super._remove( name );

        conversionGraphRegistry.removeAll( name );

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

        hook.run( 'ColorSpaceRegistry::afterRemove', name, name, this );

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

        return super.has( this.resolve( name ), safe );

    }

    public get (
        name: ColorSpaceName,
        safe: boolean = true
    ) : ColorSpaceFactory | undefined {

        return super.get( this.resolve( name ), safe );

    }

}

export const colorSpaceRegistry = new ColorSpaceRegistry ();