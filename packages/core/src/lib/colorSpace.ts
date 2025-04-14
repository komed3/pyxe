'use strict';

import type { ColorSpaceID, ColorSpaceFactory } from '@pyxe/types';

import { conversionGraph } from './graph.js';

import { ErrorHandler } from '@pyxe/utils/lib/errorHandler';

export class ColorSpace {

    private registry: Map<ColorSpaceID, ColorSpaceFactory> = new Map ();

    _register (
        id: ColorSpaceID,
        factory: ColorSpaceFactory
    ) : void {

        if ( ! this.has( id ) ) {

            this.registry.set( id, factory );

            if ( factory.conversions ) {

                conversionGraph._registerMany( id, factory.conversions );

            }

        } else {

            ErrorHandler.throw( {
                method: 'ColorSpace',
                msg: `Color space named <${id}> is already declared`
            } );

        }

    }

    has (
        id: ColorSpaceID
    ) : boolean {

        return this.registry.has( id );

    }

    check (
        id: ColorSpaceID
    ) : void {

        if ( ! this.has( id ) ) {

            ErrorHandler.throw( {
                method: 'ColorSpace',
                msg: `The color space <${id}> is not registered`
            } );

        }

    }

    get (
        id: ColorSpaceID,
        safe = true
    ) : ColorSpaceFactory | undefined {

        if ( safe ) {

            this.check( id );

        }

        return this.registry.get( id );

    }

    getSpaces () : ColorSpaceID[] {

        return Array.from( this.registry.keys() );

    }

}

export const colorSpace = new ColorSpace ();