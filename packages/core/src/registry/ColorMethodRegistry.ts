'use strict';

import { Color } from '../classes/Color.js';
import { PyxeError } from '../services/PyxeError.js';
import { hook } from '../services/Hook.js';

export const ColorMethodRegistry = {

    bind (
        method: string,
        name: string
    ) : void {

        hook.run( 'ColorMethodRegistry::bind', method, name, Color, this );

        try {

            if ( ! ( name in Color.prototype ) ) {

                ( Color.prototype as any )[ name ] = function (
                    options: Record<string, any>
                ) : Color | Color[] | any {

                    return this.apply( method, options );

                };

            }

        } catch ( err ) {

            throw new PyxeError ( {
                err, method: 'ColorMethodRegistry',
                msg: `Cannot bind method <${method}> as <${name}> to the Color class.`
            } );

        }

    },

    unbind (
        name: string
    ) : void {

        hook.run( 'ColorMethodRegistry::unbind', name, Color, this );

        if ( name in Color.prototype ) {

            delete ( Color.prototype as any )[ name ];

        } else {

            throw new PyxeError ( {
                method: 'ColorMethodRegistry',
                msg: `Method <${name}> is not bound to the Color class`
            } );

        }

    }

};