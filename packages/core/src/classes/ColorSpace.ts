'use strict';

import type { ColorSpaceID } from '@pyxe/types';
import { Utils } from '@pyxe/utils';
import { colorSpaceRegistry } from './ColorSpaceRegistry.js';

export class ColorSpace {

    public static list () : ColorSpaceID[] {

        return colorSpaceRegistry.list();

    }

    public static has (
        id: ColorSpaceID
    ) : boolean {

        return colorSpaceRegistry.has( id );

    }

    public static check (
        id: ColorSpaceID
    ) : true | undefined {

        if ( ! this.has( id ) ) {

            throw new Utils.Services.error( {
                method: 'ColorSpace',
                msg: `Cannot find color space <${id}>`
            } );

        }

        return true;

    }

    public static meta (
        id: ColorSpaceID
    ) : any {

        return colorSpaceRegistry.get( id )?.meta;

    }

}