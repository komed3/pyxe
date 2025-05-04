'use strict';

import type { ColorInput, ColorInstance, ColorSpaceName, ColorObjectFactory, ColorObjectFactoryLike, OutputOptions } from '@pyxe/types';
import { ChannelHelper, TypeCheck } from '@pyxe/utils';
import { ColorSpace } from './ColorSpace.js';
import { test } from './Validator.js';
import { Convert } from './Convert.js';
import { ModuleMethod } from './ModuleMethod.js';
import { Output } from './Output.js';
import { ColorLib } from './ColorLib.js';
import { Parser } from './Parser.js';
import { hook } from '../services/Hook.js';
import { tracer, tracerTemplates as tpl } from '../services/Tracer.js';
import { assert, catchToError } from '../services/ErrorUtils.js';

export type ColorObjectLike = ReturnType<typeof ColorObject.from> | ReturnType<typeof ColorObject.from>[] | any;

export class ColorObject {

    readonly space: ColorSpaceName;
    readonly value: ColorInstance;
    readonly alpha: number | undefined;

    private colorSpace: ColorSpace;
    private channels: string[];
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
        safe: boolean = true,
        isNormalized: boolean = false
    ) {

        this.colorSpace = ColorSpace.getInstance( space );
        this.channels = [ 'alpha', ...this.colorSpace.channels() ];

        this.space = this.colorSpace.name;
        this.alpha = ChannelHelper.alpha( 'parse', alpha );

        this.value = isNormalized ? value : ChannelHelper.instance(
            'normalize', value, this.colorSpace.getChannels()
        ) as ColorInstance;

        this.meta = meta;
        this.safe = safe;

        assert( ! this.safe || this.validate(), {
            method: 'ColorObject',
            msg: `Color <${ JSON.stringify( value ) }> is not a valid instance for <${space}> color space`
        } );

        hook.run( 'ColorObject::constructor', this );

    }

    private static _wrap (
        input: ColorObjectFactoryLike,
        safe: boolean = true,
        invoker?: ( result: any, input?: any ) => void,
        isNormalized?: boolean
    ) : ColorObjectLike {

        return Array.isArray( input )
            ? input.map( ( item ) => ColorObject._wrap( item, safe, invoker, isNormalized ) )
            : TypeCheck.ColorObjectFactory( input )
                ? ( () => {

                    const result = ColorObject.from( input, safe, isNormalized );

                    invoker?.( result, input );

                    return result;

                } )()
                : input;

    }

    private _factory () : ColorObjectFactory {

        return {
            space: this.space,
            value: this.value,
            alpha: this.alpha
        };

    }

    public toObject () : ColorObjectFactory {

        return { ...this._factory(), ...{ meta: this.meta } };

    }

    public validate () : boolean {

        return ( this.isValid ||= test.validate( this._factory(), true ) );

    }

    public instanceOf (
        space: ColorSpaceName
    ) : boolean {

        return this.space === space;

    }

    public equals (
        other: ColorObject,
        tolerance: number = 0.0005
    ) : boolean {

        return (
            this.space === other.space &&
            ChannelHelper.compareInstance(
                this.value, other.value,
                this.colorSpace.getChannels(),
                tolerance
            ) &&
            ChannelHelper.compareAlpha(
                this.alpha, other.alpha,
                tolerance
            )
        );

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

    public channel (
        key: string
    ) : number | undefined {

        assert( ! this.safe || this.channels.includes( key ), {
            method: 'ColorObject',
            msg: `Channel <${key}> is not declared in color space <${this.space}>`
        } );

        return key === 'alpha' ? this.alpha : ( this.value as any )[ key ];

    }

    public formattedChannel (
        key: string,
        options?: OutputOptions
    ) : string {

        const value = this.channel( key );

        return key === 'alpha'
            ? ChannelHelper.alpha( 'format', value, options )
            : ChannelHelper.format(
                value!,
                this.colorSpace.getChannel( key, this.safe )!,
                options, true
            );

    }

    public clone (
        overrides: Partial<ColorObjectFactory> = {},
        safe?: boolean
    ) : ColorObject {

        return ColorObject.from( {
            ...this._factory(),
            ...overrides
        }, safe ?? this.safe, true ) as ColorObject;

    }

    public as (
        target: ColorSpaceName[] | ColorSpaceName,
        strict: boolean = true
    ) : ColorObjectLike | false {

        return catchToError( () => {

            return ColorObject._wrap(
                ( this.convert ||= new Convert ( this._factory(), this.safe ) ).as( target, strict )!,
                this.safe, ( result, input ) => tracer.add( result, tpl.convert( input, result ) ),
                true
            );

        }, {
            method: 'ColorObject',
            msg: `Cannot convert <${this.space}> to any of <${ target }>`
        }, this.safe );

    }

    public asAll (
        targets: ColorSpaceName[],
        strict: boolean = true
    ) : Record<ColorSpaceName, ColorObject | false> | false {

        return catchToError( () => {

            return Object.fromEntries( [ ...new Set( targets ) ].map(
                ( t ) => [ t, this.as( t, strict ) ]
            ) );

        }, {
            method: 'ColorObject',
            msg: `Cannot convert <${this.space}> to any of <${ targets.join( ', ' ) }>`
        }, this.safe );

    }

    public apply (
        method: string,
        options?: Record<string, any>
    ) : ColorObjectLike | false {

        return catchToError( () => {

            return ColorObject._wrap(
                ( ModuleMethod.getInstance( method ) as ModuleMethod ).apply( this._factory(), options ),
                this.safe, ( result, input ) => tracer.add( result, tpl.module( method, input, result ) ),
                true
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
        safe: boolean = true,
        isNormalized: boolean = false
    ) : ColorObject | false {

        return catchToError( () => {

            return ( ( { space, value, alpha, meta } ) => new ColorObject (
                space, value, alpha, meta, safe, isNormalized
            ) )( input );

        }, {
            method: 'ColorObject',
            msg: `Cannot get color object from <${ JSON.stringify( input ) }>`
        }, safe );

    }

    public static async fromLib (
        library: string,
        key: string,
        preferredSpaces?: ColorSpaceName[],
        options: {
            sources?: string[];
            strict?: boolean;
            tryConvert?: boolean;
        } = {},
        safe: boolean = true
    ) : Promise<ColorObjectLike | false> {

        return await catchToError( async () => {

            return ColorObject._wrap(
                await ( ColorLib.getInstance( library ) as ColorLib ).getColor( key, preferredSpaces, options, safe ),
                safe, ( result ) => tracer.add( result, tpl.library( library, key, result ) )
            );

        }, {
            method: 'ColorObject',
            msg: `Cannot get color <${key}> from library <${library}>`
        }, safe );

    }

    public static parse (
        input: ColorInput,
        strict: boolean = false,
        safe: boolean = true
    ) : ColorObjectLike | false {

        return catchToError( () => {

            return ColorObject._wrap(
                Parser.parseAuto( input, strict, safe ),
                safe, ( result ) => tracer.add( result, tpl.parse( input, result ) )
            );

        }, {
            method: 'ColorObject',
            msg: `Error occured while parsing <${ JSON.stringify( input ) }>`
        }, safe );

    }

    public static compare (
        a: ColorObject,
        b: ColorObject,
        tolerance: number = 0.0005
    ) : boolean {

        return (
            a.space === b.space &&
            ChannelHelper.compareInstance(
                a.value, b.value,
                ( ColorSpace.getInstance( a.space ) as ColorSpace ).getChannels(),
                tolerance
            ) &&
            ChannelHelper.compareAlpha(
                a.alpha, b.alpha,
                tolerance
            )
        );

    }

}