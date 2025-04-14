'use strict';

import type { ColorSpaceName, ColorSpaceFactory } from '@pyxe/types';

import { conversionGraph } from './graph.js';

import { ErrorHandler } from '@pyxe/utils/lib/errorHandler';

export class ColorSpace {

    private registry: Map<ColorSpaceName, ColorSpaceFactory> = new Map ();

    _register (
        name: ColorSpaceName,
        factory: ColorSpaceFactory
    ) : void {

        if ( ! this.has( name ) ) {

            this.registry.set( name, factory );

            if ( factory.conversions ) {

                conversionGraph._registerMany( name, factory.conversions );

            }

        } else {

            ErrorHandler.throw( {
                method: 'ColorSpace',
                msg: `Color space named <${name}> is already declared`
            } );

        }

    }

    has (
        name: ColorSpaceName
    ) : boolean {

        return this.registry.has( name );

    }

    check (
        name: ColorSpaceName
    ) : void {

        if ( ! this.has( name ) ) {

            ErrorHandler.throw( {
                method: 'ColorSpace',
                msg: `The color space <${name}> is not registered`
            } );

        }

    }

    get (
        name: ColorSpaceName,
        safe = true
    ) : ColorSpaceFactory | undefined {

        if ( safe ) {

            this.check( name );

        }

        return this.registry.get( name );

    }

    getSpaces () : ColorSpaceName[] {

        return Array.from( this.registry.keys() );

    }

}

export const colorSpace = new ColorSpace ();