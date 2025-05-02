'use strict';

import type { ColorSpaceName, ColorInput, ColorObjectFactory, OutputOptions } from '@pyxe/types';
import { ColorObject, type ColorLike } from './ColorObject.js';

export { ColorLike };

export class Color {

    private constructor (
        private readonly color: ColorObject
    ) {}

    private static _wrap (
        input: ColorLike | false
    ) : Color | Color[] | any {

        return Array.isArray( input )
            ? input.map( ( item ) => Color._wrap( item ) )
            : input instanceof ColorObject
                ? new Color ( input )
                : input;

    }

    public apply (
        method: string,
        options?: Record<string, any>
    ) : ColorLike {

        return Color._wrap( this.color.apply( method, options ) );

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
        input: ColorObjectFactory
    ) : Color | false {

        return Color._wrap( ColorObject.from( input, true ) );

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
    ) : Promise<Color | false> {

        return Color._wrap( ColorObject.fromLib( library, key, preferredSpaces, options, true ) );

    }

    public static parse (
        input: ColorInput
    ) : Color | false {

        return Color._wrap( ColorObject.parse( input, false, true ) );

    }

    public static help () : string[] {

        return Object.getOwnPropertyNames( Color.prototype ).filter(
            ( method ) => ! [ 'constructor', '_wrap' ].includes( method )
        );

    }

}