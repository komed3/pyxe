'use strict';

import type { ColorInstance, ColorSpaceName, ColorObjectFactory, OutputTypes } from '@pyxe/types';
import { Validator } from './Validator.js';
import { Output } from './Output.js';
import { PyxeError } from './services/PyxeError.js';

export class ColorObject {

    readonly space: ColorSpaceName;
    readonly value: ColorInstance;

    private meta: Record<string, any> = {};

    constructor (
        space: ColorSpaceName,
        value: ColorInstance,
        safe: boolean = true
    ) {

        if ( safe && ! this.validate() ) {

            throw new PyxeError ( {
                method: 'ColorObject',
                msg: `Color <${ ( JSON.stringify( value ) ) }> is not a valid instance for <${space}> color space`
            } );

        }

        this.space = space;
        this.value = value;

    }

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
        id: ColorSpaceName
    ) : boolean {

        return this.space === id;

    }

    public validate () : boolean {

        return Validator.validate( this.toObject() );

    }

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