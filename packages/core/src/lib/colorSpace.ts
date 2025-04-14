'use strict';

import type { ColorSpaceName, ColorSpaceFactory } from '@pyxe/types';

import { ErrorHandler } from '@pyxe/utils/lib/errorHandler';

export class ColorSpace {

    private registry: Map<ColorSpaceName, ColorSpaceFactory> = new Map ();

    _register (
        name: ColorSpaceName,
        factory: ColorSpaceFactory
    ) : void {

        if ( ! this.has( name ) ) {

            this.registry.set( name, factory );

        } else {

            ErrorHandler.throw( {
                method: 'ColorSpace',
                msg: `Color space named <${name}> is already declared.`
            } );

        }

    }

    _deregister (
        name: ColorSpaceName
    ) : void {

        if ( this.has( name ) ) {

            this.registry.delete( name );

        } else {

            ErrorHandler.throw( {
                method: 'ColorSpace',
                msg: `Color space named <${name}> does not exist.`
            } );

        }

    }

    _get (
        name: ColorSpaceName,
        save = true
    ) : ColorSpaceFactory | undefined {

        if ( this.has( name ) ) {

            return this.registry.get( name );

        } else if ( save ) {

            ErrorHandler.throw( {
                method: 'ColorSpace',
                msg: `Color space named <${name}> does not exist.`
            } );

        }

    }

    has (
        name: ColorSpaceName
    ) : boolean {

        return this.registry.has( name );

    }

    getSpaces () : ColorSpaceName[] {

        return Array.from( this.registry.keys() );

    }

}

export const colorSpace = new ColorSpace ();