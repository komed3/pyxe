'use strict';

import { Color } from '../classes/Color.js';
import { catchToError, check, handleError } from '../services/ErrorUtils.js';
import { hook } from '../services/Hook.js';

export const ColorMethodRegistry = {

    isBound (
        name: string
    ) : boolean {

        return name in Color.prototype;

    },

    bind (
        method: string,
        name: string,
        invoker: ( self: Color, method: string, options: any ) => any,
        safe: boolean = false
    ) : void {

        hook.run( 'ColorMethodRegistry::bind', method, name, invoker, Color, this );

        catchToError( () => {

            if ( ! this.isBound( name ) ) {

                Object.defineProperty( Color.prototype, name, {
                    value: function ( options: Record<string, any> = {} ) {
                        return invoker( this, method, options );
                    },
                    writable: true,
                    configurable: true,
                    enumerable: false
                } );

            } else {

                handleError( {
                    method: 'ColorMethodRegistry',
                    msg: `<${name}> is already taken`
                }, safe );

            }

        }, {
            method: 'ColorMethodRegistry',
            msg: `Cannot bind method <${method}> as <${name}> to the Color class.`
        } );

    },

    unbind (
        name: string,
        safe: boolean = false
    ) : void {

        hook.run( 'ColorMethodRegistry::unbind', name, Color, this );

        check( this.isBound( name ), {
            method: 'ColorMethodRegistry',
            msg: `Method <${name}> is not bound to the Color class`
        }, safe );

        delete ( Color.prototype as any )[ name ];

    }

};