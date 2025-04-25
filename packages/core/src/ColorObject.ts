'use strict';

import type { ColorSpaceName, ColorInstance, ColorObjectFactory, OutputTypes } from '@pyxe/types';
import { Channel } from '@pyxe/utils';
import { ColorSpace } from './ColorSpace.js';
import { Output } from './Output.js';
import { Validator } from './Validator.js';
import { PyxeError } from './services/PyxeError.js';

export class ColorObject {

    readonly space: ColorSpaceName;
    readonly value: ColorInstance;

    private meta: Record<string, any>;

    constructor (
        space: ColorSpaceName,
        value: ColorInstance,
        meta: Record<string, any> = {},
        safe: boolean = true
    ) {

        this.space = space;
        this.value = value;
        this.meta = meta;

        if ( safe && ! this.validate() ) {

            throw new PyxeError ( {
                method: 'ColorObject',
                msg: `Color <${ ( JSON.stringify( value ) ) }> is not a valid instance for <${space}> color space`
            } );

        }

    }

    public static from (
        input: ColorObjectFactory
    ) : ColorObject {

        return new ColorObject (
            input.space, input.value,
            input.meta ?? {}
        );

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

    public getChannel (
        key: keyof ColorInstance,
        normalize: boolean = false
    ) : any {

        const channel = ColorSpace.channel( this.space, key );

        if ( channel && ! channel?.R && channel.range ) {

            const [ min, max ] = channel.range;

            return {
                key, channel,
                normalized: normalize,
                raw: this.value[ key ],
                value: normalize
                    ? Channel.normalize( this.value[ key ], min, max )
                    : Channel.clamp( this.value[ key ], min, max ),
            };

        }

        throw new PyxeError ( {
            method: 'ColorObject',
            msg: `Channel <${key}> for color space ${this.space} not declared`
        } );

    }

    public getFormattedChannel (
        key: keyof ColorInstance,
        options: {
            unit?: 'percent' | 'deg' | 'normalized' | unknown;
            decimals?: number;
        } = {}
    ) : string | undefined {

        const channel = this.getChannel( key );

        if ( channel ) {

            const { unit, range } = channel.channel;

            return Channel.format( channel.raw, {
                ...{ unit, min: range[ 0 ], max: range[ 1 ] },
                ...options
            } );

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