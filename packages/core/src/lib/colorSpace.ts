'use strict';

import type { ColorSpaceName, ColorSpaceFactory } from '@pyxe/types';

export class ColorSpace {

    private registry: Map<ColorSpaceName, ColorSpaceFactory> = new Map ();

    _register (
        name: ColorSpaceName,
        factory: ColorSpaceFactory
    ) : void {

        if ( ! this.has( name ) ) {

            this.registry.set( name, factory );

        } else {

            throw new Error (
                ``
            );

        }

    }

    _deregister (
        name: ColorSpaceName
    ) : void {

        if ( this.has( name ) ) {

            this.registry.delete( name );

        } else {

            throw new Error (
                ``
            );

        }

    }

    _get (
        name: ColorSpaceName,
        save = true
    ) : ColorSpaceFactory | undefined {

        if ( this.has( name ) ) {

            return this.registry.get( name );

        } else if ( save ) {

            throw new Error (
                ``
            );

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