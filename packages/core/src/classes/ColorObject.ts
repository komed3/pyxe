'use strict';

import type { ColorSpaceID, ColorInstance, ColorObjectFactory, OutputTypes } from '@pyxe/types';
import { Output } from './Output.js';

export class ColorObject {

    private meta: Record<string, any> = {};

    constructor (
        readonly space: ColorSpaceID,
        readonly value: ColorInstance
    ) {}

    public static from (
        input: ColorObjectFactory
    ) : ColorObject {

        return new ColorObject ( input.space, input.value );

    }

    public toObject () : ColorObjectFactory {

        return {
            space: this.space, value: this.value,
            meta: this.meta ?? {}
        };

    }

    public updateMeta (
        meta: Record<string, any>
    ) : void {

        this.meta = { ...this.meta, ...meta };

    }

    public deleteMeta (
        key?: string
    ) : void {

        if ( key ) {

            delete this.meta[ key ];

        } else {

            this.meta = {};

        }

    }

    public getMeta (
        key?: string
    ) : any {

        if ( key ) {

            return this.meta[ key ];

        } else {

            return this.meta;

        }

    }

    public instanceOf (
        id: ColorSpaceID
    ) : boolean {

        return this.space === id;

    }

    /*public validate () : boolean {
    }*/

    public format (
        format: OutputTypes,
        options?: Record<string, any>
    ) : unknown {

        return Output.format( format, this.toObject(), options );

    }

    public toString (
        options?: Record<string, any>
    ) : string {

        return Output.toString( this.toObject(), options );

    }

    public toJSON (
        options?: Record<string, any>
    ) : any {

        return Output.toJSON( this.toObject(), options );

    }

}