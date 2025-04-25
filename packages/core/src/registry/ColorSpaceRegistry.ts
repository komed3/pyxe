'use strict';

import type { ColorSpaceName, ColorSpaceFactory } from '@pyxe/types';
import { PyxeError } from '../services/PyxeError.js';
import { conversionGraphRegistry } from './ConversionGraphRegistry.js';
import { Registry } from './Registry.js';

export class ColorSpaceRegistry extends Registry<ColorSpaceName, ColorSpaceFactory> {

    protected aliases: Map<ColorSpaceName, ColorSpaceName> = new Map ();

    public resolve (
        name: ColorSpaceName
    ) : ColorSpaceName {

        return this.aliases.get( name ) ?? name;

    }

    public add (
        name: ColorSpaceName,
        factory: ColorSpaceFactory
    ) : void {

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

        if ( factory.conversions ) {

            conversionGraphRegistry.addMany( name, factory.conversions );

        }

    }

    public remove (
        name: ColorSpaceName
    ) : void {

        const factory = this.get( name );

        if ( factory && factory.aliases ) {

            for ( const alias of factory.aliases ) {

                this.aliases.delete( alias );

            }

        }

        conversionGraphRegistry.removeAll( name );

        super._remove( name );

    }

    public clear () {

        this.aliases.clear();

        conversionGraphRegistry.clear();

        super._clear();

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