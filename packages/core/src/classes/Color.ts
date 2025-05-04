'use strict';

import type { ColorSpaceName, ColorInput, ColorObjectFactory, OutputOptions } from '@pyxe/types';
import { ColorObject, type ColorObjectLike } from './ColorObject.js';

export type ColorLike = Color | Color[] | any;

export class Color {

    private constructor (
        private readonly color: ColorObject
    ) {}

    private static _wrap (
        input: ColorObjectLike | false
    ) : ColorLike {

        return Array.isArray( input )
            ? input.map( ( item ) => Color._wrap( item ) )
            : input instanceof ColorObject
                ? new Color ( input )
                : input;

    }

    private static _unwrap (
        input: Color | ColorObject
    ) : ColorObject {

        return input instanceof Color ? input.color : input;

    }

    public toObject () : ColorObjectFactory {

        return this.color.toObject();

    }

    public validate () : boolean {

        return this.color.validate();

    }

    public instanceOf (
        space: ColorSpaceName
    ) : boolean {

        return this.color.instanceOf( space );

    }

    public equals (
        other: Color | ColorObject,
        tolerance: number = 0.0005
    ) : boolean {

        return this.color.equals( Color._unwrap( other ), tolerance );

    }

    public meta (
        key?: string
    ) : any {

        return this.color.getMeta( key );

    }

    public channel (
        key: string
    ) : number | undefined {

        return this.color.channel( key );

    }

    public alpha () : number | undefined {

        return this.channel( 'alpha' );

    }

    public formattedChannel (
        key: string,
        options?: OutputOptions
    ) : string {

        return this.color.formattedChannel( key, options );

    }

    public clone (
        overrides: Partial<ColorObjectFactory> = {}
    ) : ColorLike {

        return Color._wrap( this.color.clone( overrides, true ) );

    }

    public as (
        target: ColorSpaceName[] | ColorSpaceName,
        strict: boolean = true
    ) : ColorLike {

        return Color._wrap( this.color.as( target, strict ) );

    }

    public asAll (
        targets: ColorSpaceName[],
        strict: boolean = true
    ) : ColorLike {

        return Color._wrap( this.color.asAll( targets, strict ) );

    }

    public apply (
        method: string,
        options?: Record<string, any>
    ) : ColorLike {

        return Color._wrap( this.color.apply( method, options ) );

    }

    public format (
        type: string,
        options?: OutputOptions
    ) : any {

        return this.color.format( type, options ?? {} );

    }

    public toJSON (
        options?: OutputOptions
    ) : any {

        return this.format( 'json', options );

    }

    public toString (
        options?: OutputOptions
    ) : string {

        return this.format( 'string', options );

    }

    public toCLI (
        options?: OutputOptions
    ) : string {

        return this.format( 'cli', options );

    }

    public static from (
        input: ColorObjectFactory,
        isNormalized?: boolean
    ) : ColorLike {

        return Color._wrap( ColorObject.from( input, true, isNormalized ) );

    }

    public static async fromLib (
        library: string,
        key: string,
        preferredSpaces?: ColorSpaceName[],
        options: {
            sources?: string[];
            strict?: boolean;
            tryConvert?: boolean;
        } = {}
    ) : Promise<ColorLike> {

        return Color._wrap( await ColorObject.fromLib( library, key, preferredSpaces, options, true ) );

    }

    public static parse (
        input: ColorInput
    ) : ColorLike {

        return Color._wrap( ColorObject.parse( input, false, true ) );

    }

    public static compare (
        a: Color | ColorObject,
        b: Color | ColorObject,
        tolerance?: number
    ) : boolean {

        return ColorObject.compare( Color._unwrap( a ), Color._unwrap( b ), tolerance );

    }

    public static help () : string[] {

        return Object.getOwnPropertyNames( Color.prototype ).filter(
            ( method ) => ! [ 'constructor', '_wrap' ].includes( method )
        );

    }

}