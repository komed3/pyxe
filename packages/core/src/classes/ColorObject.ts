'use strict';

import type { ColorInstance, ColorObjectFactory, ColorSpaceName } from '@pyxe/types';
import { ColorSpace } from './ColorSpace.js';
import { test } from './Validator.js';
import { assert } from '../services/ErrorUtils.js';

export class ColorObject {

    readonly space: ColorSpaceName;
    readonly value: ColorInstance;
    readonly alpha: number | undefined;

    private colorSpace: ColorSpace;
    private meta: Record<string, any> = {};
    private isValid: boolean | undefined;

    constructor (
        space: ColorSpaceName,
        value: ColorInstance,
        alpha: number | undefined = undefined,
        meta: Record<string, any> = {},
        safe: boolean = true
    ) {

        this.colorSpace = ColorSpace.getInstance( space );

        this.space = this.colorSpace.space;
        this.value = value;
        this.alpha = alpha;
        this.meta = meta;

        assert( ! safe || this.validate(), {
            method: 'ColorObject',
            msg: `Color <${ ( JSON.stringify( value ) ) }> is not a valid instance for <${space}> color space`
        } );

    }

    public static from (
        input: ColorObjectFactory,
        safe: boolean = true
    ) : ColorObject {

        const { space, value, alpha, meta } = input;

        return new ColorObject ( space, value, alpha, meta, safe );

    }

    private _factory () : ColorObjectFactory {

        return {
            space: this.colorSpace.space,
            value: this.value,
            alpha: this.alpha
        };

    }

    public toObject () : ColorObjectFactory {

        return { ...this._factory(), ...{ meta: this.meta } };

    }

    public validate () : boolean {

        if ( this.isValid === undefined ) {

            this.isValid = test.validate( this._factory() );

        }

        return this.isValid;

    }

    public instanceOf (
        name: ColorSpaceName
    ) : boolean {

        return this.space === name;

    }

    public updateMeta (
        meta: Record<string, any>
    ) : void {

        this.meta = { ...this.meta, meta };

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

}