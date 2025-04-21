'use strict';

import type { ColorSpaceID, ColorInput, ColorInstance, ColorObjectFactory, OutputTypes } from '@pyxe/types';
import { Utils } from '@pyxe/utils';
import { ColorSpace } from './ColorSpace.js';
import { ColorObject } from './ColorObject.js';
import { Parser } from './Parser.js';
import { ColorLib } from './ColorLib.js';
import { Convert } from './Convert.js';

export class Color {

    private color: ColorObject;

    private constructor (
        color: ColorObject
    ) {

        ColorSpace.check( color.space );

        color.validate();

        this.color = color;

    }

    public static from (
        input: ColorObjectFactory
    ) : Color {

        return new Color (
            ColorObject.from( input )
        );

    }

    public static parse (
        input: ColorInput,
        safe: boolean = true
    ) : Color | undefined {

        try {

            return new Color (
                Parser.parse( input )!
            );

        } catch ( err ) {

            if ( safe ) {

                throw new Utils.Services.error( {
                    err, method: 'Color',
                    msg: `Failed to parse input <${input}>`
                } );

            }

        }

    }

    public static async fromLib (
        id: string,
        key: string,
        preferredSpaces?: ColorSpaceID[],
        options: {
            sources?: string[];
            strict?: boolean;
            tryConvert?: boolean;
        } = {},
        safe: boolean = true
    ) : Promise<Color | undefined> {

        try {

            const lib = ColorLib.getInstance( id );

            return new Color (
                ( await lib.getColor(
                    key, preferredSpaces, options
                ) )!
            );

        } catch ( err ) {

            if ( safe ) {

                throw new Utils.Services.error( {
                    err, method: 'Color',
                    msg: `Failed to load color <${key}> from library <${id}>`
                } );

            }

        }

    }

    public toObject () : ColorObjectFactory {

        return this.color.toObject();

    }

    public getSpace () : ColorSpaceID {

        return this.color.space;

    }

    public getInstance () : ColorInstance {

        return this.color.value;

    }

    public getMeta (
        key?: string
    ) : any {

        return this.color.getMeta( key );

    }

    public instanceOf (
        space: ColorSpaceID
    ) : boolean {

        return this.color.instanceOf( space );

    }

    public format (
        format: OutputTypes,
        options?: Record<string, any>
    ) : unknown {

        return this.color.format( format, options );

    }

    public toString (
        options?: Record<string, any>
    ) : string {

        return this.color.toString( options );

    }

    public toJSON (
        options?: Record<string, any>
    ) : any {

        return this.color.toJSON( options );

    }

    public convert (
        target: ColorSpaceID | ColorSpaceID[],
        safe: boolean = true
    ) : Color | undefined {

        try {

            return new Color (
                Convert.convert( this.color, target )!
            );

        } catch ( err ) {

            if ( safe ) {

                throw new Utils.Services.error( {
                    err, method: 'Color',
                    msg: `Failed to convert into <${target}> color space`
                } );

            }

        }

    }

    public tryConvert (
        target: ColorSpaceID | ColorSpaceID[]
    ) : Color {

        return new Color (
            Convert.tryConvert( this.color, target ) as ColorObject
        );

    }

}