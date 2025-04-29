'use strict';

import { Color } from '../classes/Color.js';
import { assert, catchToError } from '../services/ErrorUtils.js';
import { hook } from '../services/Hook.js';

export const ColorMethodRegistry = {

    isBound (
        name: string
    ) : boolean {

        return name in Color.prototype;

    },

    bind (
        method: string,
        name: string
    ) : void {

        hook.run( 'ColorMethodRegistry::bind', method, name, Color, this );

        catchToError( () => {

            if ( ! this.isBound( name ) ) {

                Object.defineProperty( Color.prototype, name, {
                    value: function ( options: Record<string, any> ) {
                        return this.apply( method, options );
                    },
                    writable: true,
                    configurable: true,
                    enumerable: false
                } );

            }

        }, {
            method: 'ColorMethodRegistry',
            msg: `Cannot bind method <${method}> as <${name}> to the Color class.`
        } );

    },

    unbind (
        name: string
    ) : void {

        hook.run( 'ColorMethodRegistry::unbind', name, Color, this );

        assert( this.isBound( name ), {
            method: 'ColorMethodRegistry',
            msg: `Method <${name}> is not bound to the Color class`
        } );

        delete ( Color.prototype as any )[ name ];

    }

};