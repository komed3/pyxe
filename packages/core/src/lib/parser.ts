'use strict';

import type { ColorInput, ColorObject, ColorSpaceFactory } from '@pyxe/types';
import { colorSpace } from './colorSpace.js';

export class Parser {

    static parse (
        input: ColorInput
    ) : ColorObject {

        try {

            for ( const space of colorSpace.getSpaces() ) {

                try {

                    const { parser: handler } = colorSpace._get( space ) as ColorSpaceFactory;

                    if ( handler && typeof handler === 'function' ) {

                        const result = handler( input );

                        if ( result ) {

                            return result;

                        }

                    }

                } catch {}

            }

        } catch ( err ) {

            throw new Error (
                ``
            );

        }

    }

    static try (
        input: ColorInput
    ) : boolean {

        try {

            this.parse( input );

        } catch {

            return false;

        }

        return true;

    }

}