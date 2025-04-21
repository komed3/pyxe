'use strict';

import type { ColorSpaceID, ColorSpaceFactory } from '@pyxe/types';
import { Utils } from '@pyxe/utils';
import { conversionGraphRegistry } from './ConversionGraphRegistry';

export class ColorSpaceRegistry {

    private registry: Map<ColorSpaceID, ColorSpaceFactory> = new Map();

    public add (
        id: ColorSpaceID,
        factory: ColorSpaceFactory
    ) : void {

        if ( this.has( id ) ) {

            throw new Utils.Services.error( {
                method: 'ColorSpaceRegistry',
                msg: `Color space named <${id}> is already declared`
            } );

        }

        this.registry.set( id, factory );

        if ( factory?.conversions ) {

            conversionGraphRegistry.addMany( id, factory.conversions );

        }

    }

    public remove (
        id: ColorSpaceID
    ) : void {

        if ( ! this.has( id ) ) {

            throw new Utils.Services.error( {
                method: 'ColorSpaceRegistry',
                msg: `The color space <${id}> is not declared`
            } );

        }

        conversionGraphRegistry.removeAll( id );

        this.registry.delete( id );

    }

    public list () : ColorSpaceID[] {

        return [ ...this.registry.keys() ];

    }

    public has (
        id: ColorSpaceID
    ) : boolean {

        return this.registry.has( id );

    }

    public get (
        id: ColorSpaceID
    ) : ColorSpaceFactory | undefined {

        return this.registry.get( id );

    }

}

export const colorSpaceRegistry = new ColorSpaceRegistry();