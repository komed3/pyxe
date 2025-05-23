'use strict';

import type { ColorSpaceName, ColorSpaceFactory } from '@pyxe/types';
import { Registry } from './Registry.js';
import { ColorMethodRegistry } from './ColorMethodRegistry.js';
import { conversionGraphRegistry } from './ConversionGraphRegistry.js';
import { outputRegistry } from './OutputRegistry.js';
import { assert } from '../services/ErrorUtils.js';
import { hook } from '../services/Hook.js';

export class ColorSpaceRegistry extends Registry<ColorSpaceName, ColorSpaceFactory> {

    protected aliases: Map<ColorSpaceName, ColorSpaceName> = new Map ();

    private _methodName (
        name: ColorSpaceName
    ) : string {

        return hook.filter( 'ColorSpaceFactory::methodName', `as${ name.toUpperCase() }`, name, this );

    }

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
        colorSpace: ColorSpaceFactory
    ) : void {

        hook.run( 'ColorSpaceRegistry::beforeAdd', name, colorSpace, this );

        super._add( name, colorSpace );

        outputRegistry.addMany( name, colorSpace.output ?? {} );

        ColorMethodRegistry.bind(
            name, this._methodName( name ),
            ( self, method, options ) => self.as( method, options?.strict )
        );

        if ( colorSpace.aliases ) {

            for ( const alias of colorSpace.aliases ) {

                assert( ! this.items.has( alias ) && ! this.aliases.has( alias ), {
                    method: 'ColorSpaceRegistry',
                    msg: `Alias <${alias}> is already declared for <${ this.resolve( alias ) }>`
                } );

                this.aliases.set( alias, name );

            }

        }

        if ( colorSpace.hooks ) {

            for ( const [ key, handler ] of Object.entries( colorSpace.hooks ) ) {

                hook.add( key, handler );

            }

        }

        if ( colorSpace.conversions ) {

            conversionGraphRegistry.addMany( name, colorSpace.conversions );

        }

        hook.run( 'ColorSpaceRegistry::afterAdd', name, colorSpace, this );

    }

    public remove (
        name: ColorSpaceName
    ) : void {

        const colorSpace = this.get( name );

        hook.run( 'ColorSpaceRegistry::beforeRemove', name, this );

        super._remove( name );

        conversionGraphRegistry.removeAll( name );

        outputRegistry.removeAll( name );

        ColorMethodRegistry.unbind( name );

        if ( colorSpace?.aliases ) {

            for ( const alias of colorSpace.aliases ) {

                this.aliases.delete( alias );

            }

        }

        if ( colorSpace?.hooks ) {

            for ( const [ key, handler ] of Object.entries( colorSpace.hooks ) ) {

                hook.remove( key, handler );

            }

        }

        hook.run( 'ColorSpaceRegistry::afterRemove', name, this );

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