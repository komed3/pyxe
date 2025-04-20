'use strict';

import type { ColorSpaceID, ColorSpaceFactory } from '@pyxe/types';

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

            // ERROR

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

            // ERROR

        }

        this.spaces.set( id, factory );

    }

    public remove (
        id: ColorSpaceID
    ) : void {

        if ( ! this.has( id ) ) {

            // ERROR

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