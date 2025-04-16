'use strict';

import { ColorInput, ColorInstance, ColorObject, ColorSpaceID, ModuleFactory } from '@pyxe/types';
import { Utils } from '@pyxe/utils';
import { Validator } from './validator.js';
import { Parser } from './parser.js';
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

            throw err;

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

    convert (
        target: ColorSpaceID
    ) : Color {

        try {

            return new Color (
                convert.convert( this.toObject(), target ) as ColorObject
            );

        } catch ( err ) {

            throw err;

        }

    }

    getSpace () : ColorSpaceID {

        return this.toObject().space;

    }

    getInstance () : ColorInstance {

        return this.toObject().value;

    }

    apply (
        id: string,
        ...args: any[]
    ) : Color | Color[] | any {

        const result = module.apply(
            id, this.toObject(),
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

            if ( result.space && result.value ) {

                return new Color( result );

            }

        }

        return result;

    }

};

export const ColorMethodRegistry = {

    add (
        name: string,
        factory: ModuleFactory
    ) : void {

        try {

            const { exposeAsMethod = false } = factory;

            if ( exposeAsMethod && ! ( name in Color.prototype ) ) {

                ( Color.prototype as any )[ name ] = function (
                    ...args: any[]
                ) : Color | Color[] | any {

                    return this.apply( name, ...args );

                };

            }

        } catch ( err ) {

            throw new Utils.error( {
                err, method: 'ColorMethodRegistry',
                msg: `Cannot add method for module <${name}> to the Color class.`
            } );

        }

    },

    remove (
        name: string
    ) : void {

        if ( name in Color.prototype ) {

            delete ( Color.prototype as any )[ name ];

        } else {

            throw new Utils.error( {
                method: 'ColorMethodRegistry',
                msg: `Method for module <${name}> is not bound to the Color class`
            } );

        }

    }

};