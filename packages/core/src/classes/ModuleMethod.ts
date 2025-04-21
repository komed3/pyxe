'use strict';

import { Utils } from '@pyxe/utils';
import { moduleMethodRegistry } from './ModuleMethodRegistry.js';
import { ColorObject } from './ColorObject.js';

export class ModuleMethod {

    public static list (
        filter?: string
    ) : string[] {

        return moduleMethodRegistry.filter( filter );

    }

    public static map () : Record<string, string[]> {

        return [ ...moduleMethodRegistry.list() ].reduce(
            ( map, key ) => (
                ( map[ key.split( '::' )[ 0 ] ] ??= [] ).push(
                    key.split( '::' )[ 1 ]
                ), map
            ), {} as Record<string, string[]>
        );

    }

    public static has (
        key: string
    ) : boolean {

        return moduleMethodRegistry.has( key );

    }

    public static check (
        key: string
    ) : true | undefined {

        if ( ! this.has( key ) ) {

            throw new Utils.Services.error( {
                method: 'ModuleMethod',
                msg: `Method <${key}> is not declared`
            } );

        }

        return true;

    }

    public static meta (
        key: string
    ) : any {

        return moduleMethodRegistry.get( key )?.meta;

    }

    public static apply (
        key: string,
        color: ColorObject,
        options?: Record<string, any>,
        safe: boolean = true
    ) : any {

        if ( this.check( key ) ) {

            try {

                const { spaces, handler } = moduleMethodRegistry.get( key )!;

                if ( options?.strict && ! spaces.includes( color.space ) ) {

                    throw new Utils.Services.error( {
                        method: 'ModuleMethod',
                        msg: `Method <${key}> does not support color space <${color.space}>`
                    } );

                }

                return handler( color.toObject(), options );

            } catch ( err ) {

                if ( safe ) {

                    throw new Utils.Services.error( {
                        err, method: 'ModuleMethod',
                        msg: `Error occurred in method <${key}>`
                    } );

                }

            }

        }

    }

}