'use strict';

import type { ColorSpaceID, ColorInstance, ColorObjectFactory } from '@pyxe/types';

export class ColorObject {

    readonly space: ColorSpaceID;

    readonly value: ColorInstance;

    private meta: Record<string, any> = {};

    constructor (
        space: ColorSpaceID,
        value: ColorInstance
    ) {

        this.space = space;
        this.value = value;

    }

    public static fromObject (
        input: ColorObjectFactory
    ) : ColorObject {

        return new ColorObject ( input.space, input.value );

    }

    public instanceOf (
        id: ColorSpaceID
    ) : boolean {

        return this.space === id;

    }

    public validate () : boolean {

        return true;

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

    public toObject () : ColorObjectFactory {

        return {
            space: this.space, value: this.value,
            meta: this.meta ?? {}
        };

    }

    public format (
        format: string,
        options?: Record<string, any>
    ) : unknown {

        return '';

    }

    public toString (
        options?: Record<string, any>
    ) : string {

        return '';

    }

    public toJSON (
        options?: Record<string, any>
    ) : any {

        return {};

    }

}