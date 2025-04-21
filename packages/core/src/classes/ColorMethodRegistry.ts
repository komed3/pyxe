'use strict';

import { Utils } from '@pyxe/utils';
import { Color } from './Color.js';

export const ColorMethodRegistry = {

    bind (
        method: string,
        name: string
    ) : void {

        try {

            if ( ! ( name in Color.prototype ) ) {

                ( Color.prototype as any )[ name ] = function (
                    options: Record<string, any>
                ) : Color | Color[] | any {

                    return this.apply( method, options );

                };

            }

        } catch ( err ) {

            throw new Utils.Services.error( {
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

            throw new Utils.Services.error( {
                method: 'ColorMethodRegistry',
                msg: `Method <${key}> is not bound to the Color class`
            } );

        }

    }

};