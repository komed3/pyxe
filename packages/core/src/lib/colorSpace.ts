'use strict';

import type {
    ColorSpaceID, ColorSpaceFactory
} from '@pyxe/types';

import { ErrorHandler } from '@pyxe/utils/lib/errorHandler';
import { conversionGraph } from './graph.js';

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

    _unregister (
        id: ColorSpaceID
    ) : void {

        if ( this.check( id ) ) {

            this.registry.delete( id );

            conversionGraph._unregisterAll( id );

        }

    }

    has (
        id: ColorSpaceID
    ) : boolean {

        return this.registry.has( id );

    }

    check (
        id: ColorSpaceID
    ) : boolean {

        const has = this.has( id );

        if ( ! has ) {

            ErrorHandler.throw( {
                method: 'ColorSpace',
                msg: `The color space <${id}> is not registered`
            } );

        }

        return has;

    }

    get (
        id: ColorSpaceID,
        safe = true
    ) : ColorSpaceFactory | undefined {

        if ( ! safe || this.check( id ) ) {

            return this.registry.get( id );

        }

    }

    getSpaces () : ColorSpaceID[] {

        return Array.from(
            this.registry.keys()
        );

    }

    getMeta (
        id: ColorSpaceID
    ) : any {

        return this.get( id )?.meta;

    }

}

export const colorSpace = new ColorSpace ();