'use strict';

import type { ColorSpaceID, ColorSpaceFactory } from '@pyxe/types';
import Utils from '@pyxe/utils';

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

        if ( ! colorSpaceRegistry.has( id ) ) {

            throw new Utils.error ( {
                method: 'ColorSpace',
                msg: `Cannot find color space <${id}>`
            } );

        }

        return true;

    }

}

export class ColorSpaceRegistry {

    private spaces: Map<ColorSpaceID, ColorSpaceFactory> = new Map ();

    public add (
        id: ColorSpaceID,
        factory: ColorSpaceFactory
    ) : void {

        if ( this.has( id ) ) {

            throw new Utils.error ( {
                method: 'ColorSpace',
                msg: `Color space named <${id}> is already declared`
            } );

        }

        this.spaces.set( id, factory );

    }

    public remove (
        id: ColorSpaceID
    ) : void {

        if ( ! this.has( id ) ) {

            throw new Utils.error ( {
                method: 'ColorSpace',
                msg: `The color space <${id}> is not declared`
            } );

        }

        this.spaces.delete( id );

    }

    public list () : ColorSpaceID[] {

        return [ ...this.spaces.keys() ];

    }

    public has (
        id: ColorSpaceID
    ) : boolean {

        return this.spaces.has( id );

    }

    public get (
        id: ColorSpaceID
    ) : ColorSpaceFactory | undefined {

        return this.spaces.get( id );

    }

}

export const colorSpaceRegistry = new ColorSpaceRegistry ();