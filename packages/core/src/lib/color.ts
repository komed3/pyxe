'use strict';

import {
    ColorInput, ColorInstance, ColorObject,
    ColorSpaceID, OutputTypes
} from '@pyxe/types';

import { Utils } from '@pyxe/utils';
import { Validator } from './validator.js';
import { Parser } from './parser.js';
import { ColorLib } from './colorLib.js';
import { Output } from './output.js';

import { colorSpace } from './colorSpace.js';
import { convert } from './convert.js';
import { module } from './module.js';

export class Color {

    private color: ColorObject;

    private constructor (
        color: ColorObject
    ) {

        colorSpace.check( color.space );

        Validator.validate( color );

        this.color = color;

    }

    static isColor (
        input: ColorObject
    ) : boolean {

        return Validator.try( input );

    }

    static from (
        input: ColorObject
    ) : Color {

        return new Color ( input );

    }

    static parse (
        input: ColorInput
    ) : Color {

        try {

            return new Color (
                Parser.parse( input ) as ColorObject
            );

        } catch ( err ) {

            throw new Utils.error( {
                err, method: 'Color',
                msg: `Failed to load parsed color`
            } );

        }

    }

    static async fromLib (
        colorLib: string,
        colorID: string,
        preferredSpaces?: ColorSpaceID[],
        options: {
            sources?: string[];
            strict?: boolean;
            tryConvert?: boolean;
        } = {}
    ) {

        try {

            const lib = ColorLib.getInstance( colorLib );

            return new Color(
                await lib.getColor(
                    colorID, preferredSpaces, options
                ) as ColorObject
            );

        } catch ( err ) {

            throw new Utils.error( {
                err, method: 'Color',
                msg: `Failed to load color <${colorID}> from library <${colorLib}>`
            } );

        }

    }

    validate () : boolean {

        return Validator.try( this.color );

    }

    instanceOf (
        space: ColorSpaceID
    ) : boolean {

        try {

            Validator.instanceOf( space, this.color.value );

        } catch {

            return false;

        }

        return true;

    }

    toObject () : ColorObject {

        return this.color;

    }

    toString () : string {

        return Output.toString( this.toObject() );

    }

    toJSON () : unknown {

        return Output.toJSON( this.toObject() );

    }

    format (
        format: OutputTypes
    ) : unknown {

        return Output.format( format, this.toObject() );

    }

    convert (
        target: ColorSpaceID
    ) : Color {

        try {

            return new Color (
                convert.convert( this.toObject(), target ) as ColorObject
            );

        } catch ( err ) {

            throw new Utils.error( {
                err, method: 'Color',
                msg: `Failed to convert into <${target}> color space`
            } );

        }

    }

    tryConvert (
        target: ColorSpaceID
    ) : Color {

        return new Color (
            convert.tryConvert( this.toObject(), target ) as ColorObject
        );

    }

    getSpace () : ColorSpaceID {

        return this.toObject().space;

    }

    getInstance () : ColorInstance {

        return this.toObject().value;

    }

    apply (
        key: string,
        ...args: any[]
    ) : Color | Color[] | any {

        const result = module.apply(
            key, this.toObject(),
            ...args
        );

        if ( result && typeof result === 'object' ) {

            if ( Array.isArray( result ) ) {

                return result.map(
                    ( res ) => res?.space && res?.value
                        ? new Color ( res )
                        : res
                );

            }

            if ( result?.space && result?.value ) {

                return new Color( result );

            }

        }

        return result;

    }

};

export const ColorMethodRegistry = {

    bind (
        method: string,
        name: string
    ) : void {

        try {

            if ( ! ( name in Color.prototype ) ) {

                ( Color.prototype as any )[ name ] = function (
                    ...args: any[]
                ) : Color | Color[] | any {

                    return this.apply( method, ...args );

                };

            }

        } catch ( err ) {

            throw new Utils.error( {
                err, method: 'ColorMethodRegistry',
                msg: `Cannot bind method <${method}> as <${name}> to the Color class.`
            } );

        }

    },

    unbind (
        key: string
    ) : void {

        if ( key in Color.prototype ) {

            delete ( Color.prototype as any )[ key ];

        } else {

            throw new Utils.error( {
                method: 'ColorMethodRegistry',
                msg: `Method <${key}> is not bound to the Color class`
            } );

        }

    }

};