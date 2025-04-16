'use strict';

import { ColorSpaceID, ColorObject, OutputTypes, OutputHandler, ColorSpaceFactory } from '@pyxe/types';
import { colorSpace } from './colorSpace.js';

export class Output {

    static _getHandler (
        id: ColorSpaceID,
        handler: OutputTypes
    ) : OutputHandler | undefined {

        if ( colorSpace.has( id ) ) {

            const { output } = colorSpace.get( id ) as ColorSpaceFactory;

            if ( output && handler in output ) {

                return output[ handler ];

            }

        }

    }

    static toString (
        input: ColorObject
    ) : string {

        try {

            return ( this._getHandler(
                input.space, 'string'
            ) as OutputHandler )( input ) as string;

        } catch {

            return JSON.stringify( input.value );

        }

    }

    static toJSON (
        input: ColorObject
    ) : unknown {

        try {

            return ( this._getHandler(
                input.space, 'json'
            ) as OutputHandler )( input );

        } catch {

            return {
                space: input.space,
                value: input.value
            };

        }

    }

}