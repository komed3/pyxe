'use strict';

import type { ColorLibFactory } from '@pyxe/types';
import { Utils } from '@pyxe/utils';

export class ColorLibRegisty {

    private registry: Map<string, ColorLibFactory> = new Map();

    public add (
        id: string,
        factory: ColorLibFactory
    ) : void {

        if ( this.has( id ) ) {

            throw new Utils.Services.error( {
                method: 'ColorLibRegistry',
                msg: `Color library named <${id}> already registered`
            } );

        }

        this.registry.set( id, factory );

    }

    public remove (
        id: string
    ) : void {

        if ( ! this.has( id ) ) {

            throw new Utils.Services.error( {
                method: 'ColorLibRegistry',
                msg: `The library named <${id}> is not declared`
            } );

        }

        this.registry.delete( id );

    }

    public list () : string[] {

        return [ ...this.registry?.keys() ];

    }

    public has (
        id: string
    ) : boolean {

        return this.registry.has( id );

    }

    public get (
        id: string
    ) : ColorLibFactory | undefined {

        return this.registry.get( id );

    }

}

export const colorLibRegisty = new ColorLibRegisty();