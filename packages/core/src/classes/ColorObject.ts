'use strict';

import type { ColorInstance, ColorObjectFactory, ColorSpaceName, ModuleMethodReturnValue, OutputOptions } from '@pyxe/types';
import { ChannelHelper, TypeCheck } from '@pyxe/utils';
import { ColorSpace } from './ColorSpace.js';
import { Convert } from './Convert.js';
import { ModuleMethod } from './ModuleMethod.js';
import { Output } from './Output.js';
import { test } from './Validator.js';
import { tracer, tracerTemplates as tpl } from '../services/Tracer.js';
import { assert, catchToError } from '../services/ErrorUtils.js';

export class ColorObject {

    readonly space: ColorSpaceName;
    readonly value: ColorInstance;
    readonly alpha: number | undefined;

    private colorSpace: ColorSpace;
    private convert: Convert | undefined;
    private output: Output | undefined;

    private meta: Record<string, any> = {};
    private isValid: boolean | undefined;
    private safe: boolean;

    constructor (
        space: ColorSpaceName,
        value: ColorInstance,
        alpha: number | undefined = undefined,
        meta: Record<string, any> = {},
        safe: boolean = true
    ) {

        this.colorSpace = ColorSpace.getInstance( space );

        this.space = this.colorSpace.name;
        this.value = value;
        this.alpha = alpha;

        this.meta = meta;
        this.safe = safe;

        assert( ! this.safe || this.validate(), {
            method: 'ColorObject',
            msg: `Color <${ ( JSON.stringify( value ) ) }> is not a valid instance for <${space}> color space`
        } );

    }

    private _factory () : ColorObjectFactory {

        return {
            space: this.space,
            value: this.value,
            alpha: this.alpha
        };

    }

    private _mapInstance (
        input: ModuleMethodReturnValue
    ) : ColorObject | ColorObject[] | any {

        return Array.isArray( input )
            ? input.map( ( item ) => this._mapInstance( item ) )
            : TypeCheck.ColorObjectFactory( input )
                ? ColorObject.from( input, this.safe )
                : input;

    }

    public toObject () : ColorObjectFactory {

        return { ...this._factory(), ...{ meta: this.meta } };

    }

    public validate () : boolean {

        return ( this.isValid ||= test.validate( this._factory() ) );

    }

    public instanceOf (
        name: ColorSpaceName
    ) : boolean {

        return this.space === name;

    }

    public updateMeta (
        meta: Record<string, any>
    ) : void {

        this.meta = { ...this.meta, ...meta };

    }

    public deleteMeta (
        key?: string
    ) : void {

        key ? delete this.meta[ key ] : this.meta = {};

    }

    public getMeta (
        key?: string
    ) : any {

        return key ? this.meta[ key ] : this.meta;

    }

    public channel () {}

    public formattedChannel () {}

    public clone (
        overrides: Partial<ColorObjectFactory> = {}
    ) : ColorObject {

        return new ColorObject (
            overrides.space ?? this.space,
            overrides.value ?? this.value,
            overrides.alpha ?? this.alpha,
            { ...this.meta, ...(
                overrides.meta ?? {}
            ) },
            true
        );

    }

    public to (
        target: ColorSpaceName[] | ColorSpaceName,
        strict: boolean = true
    ) : ColorObject | false {

        return catchToError( () => {

            const color = ColorObject.from( (
                this.convert ||= new Convert ( this._factory(), this.safe )
            ).to( target, strict )!, this.safe );

            if ( tracer.isReady() ) {

                tracer.add( color, tpl.convert( this, color ) );

            }

            return color;

        }, {
            method: 'ColorObject',
            msg: `Cannot convert <${this.space}> to any of <${ target }>`
        }, this.safe );

    }

    public toAll (
        targets: ColorSpaceName[],
        strict: boolean = true
    ) : Record<ColorSpaceName, ColorObject | false> | false {

        return catchToError( () => {

            return Object.fromEntries( [ ...new Set( targets ) ].map(
                ( t ) => [ t, this.to( t, strict ) ]
            ) );

        }, {
            method: 'ColorObject',
            msg: `Cannot convert <${this.space}> to any of <${ targets.join( ', ' ) }>`
        }, this.safe );

    }

    public apply (
        method: string,
        options?: Record<string, any>
    ) : ColorObject | ColorObject[] | any {

        return catchToError( () => {

            return this._mapInstance(
                ( ModuleMethod.getInstance( method ) as ModuleMethod ).apply(
                    this._factory(), options
                )
            );

        }, {
            method: 'ColorObject',
            msg: `Cannot apply method <${method}>`
        }, this.safe );

    }

    public format (
        type: string,
        options: OutputOptions = {}
    ) : any {

        return catchToError( () => {

            return ( this.output ||= ( Output.getInstance( this.space ) as Output ) ).format(
                type, this._factory(), options, this.safe
            );

        }, {
            method: 'ColorObject',
            msg: `Cannot output as <${type}>`
        }, this.safe );

    }

    public static from (
        input: ColorObjectFactory,
        safe: boolean = true
    ) : ColorObject {

        const { space, value, alpha, meta } = input;

        return new ColorObject ( space, value, alpha, meta, safe );

    }

    public static fromLib () {}

    public static parse () {}

}