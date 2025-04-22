'use strict';

import type { ColorSpaceName } from '@pyxe/types';
import { colorSpaceRegistry } from './registry/ColorSpaceRegistry.js';
import { PyxeError } from './services/PyxeError.js';

export class ColorSpace {

    public static list () : ColorSpaceName[] {

        return colorSpaceRegistry.list();

    }

    public static filter (
        filter?: string
    ) : ColorSpaceName[] {

        return colorSpaceRegistry.filter( filter );

    }

    public static has (
        name: ColorSpaceName
    ) : boolean {

        return colorSpaceRegistry.has( name );

    }

    public static check (
        name: ColorSpaceName
    ) : true | undefined {

        if ( ! this.has( name ) ) {

            throw new PyxeError ( {
                method: 'ColorSpace',
                msg: `Cannot find color space <${name}>`
            } );

        }

        return true;

    }

    public static meta (
        name: ColorSpaceName
    ) : any {

        return colorSpaceRegistry.get( name )?.meta;

    }

}