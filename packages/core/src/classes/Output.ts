'use strict';

import { ColorSpaceID, ColorSpaceFactory, ColorObjectFactory, OutputTypes, OutputHandler } from '@pyxe/types';
import { Utils } from '@pyxe/utils';
import { colorSpaceRegistry } from './ColorSpaceRegistry.js';

export class Output {

    private static _getHandler (
        id: ColorSpaceID,
        format: OutputTypes
    ) : OutputHandler | undefined {

        if ( colorSpaceRegistry.has( id ) ) {

            const { output } = colorSpaceRegistry.get( id ) as ColorSpaceFactory;

            if (
                output && format in output &&
                typeof output[ format ] === 'function'
            ) {

                return output[ format ];

            }

        }

    }

    public static format (
        format: OutputTypes,
        input: ColorObjectFactory,
        options?: Record<string, any>
    ) : unknown {

        const handler = this._getHandler(
            input.space, format
        );

        if ( ! handler ) {

            throw new Utils.Services.error( {
                method: 'Output',
                msg: `No output format <${format}> defined for color space <${input.space}>`
            } );

        }

        return handler( input, options );

    }

    public static toString (
        input: ColorObjectFactory,
        options?: Record<string, any>
    ) : string {

        try {

            return this.format( 'string', input, options ) as string;

        } catch {

            return `[${ input.space }] ${ JSON.stringify( input.value ) }`;

        }

    }

    public static toJSON (
        input: ColorObjectFactory,
        options?: Record<string, any>
    ) : unknown {

        try {

            return this.format( 'json', input, options );

        } catch {

            return {
                space: input.space,
                value: input.value
            };

        }

    }

}