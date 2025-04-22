'use strict';

import { moduleRegistry } from './registry/ModuleRegistry.js';
import { ModuleMethod } from './ModuleMethod.js';
import { PyxeError } from './services/PyxeError.js';

export class Module {

    public static list () : string[] {

        return moduleRegistry.list();

    }

    public static has (
        id: string
    ) : boolean {

        return moduleRegistry.has( id );

    }

    public static check (
        id: string
    ) : true | undefined {

        if ( ! this.has( id ) ) {

            throw new PyxeError ( {
                method: 'Module',
                msg: `Module <${id}> is not declared`
            } );

        }

        return true;

    }

    public static meta (
        id: string
    ) : any {

        return moduleRegistry.get( id )?.meta;

    }

    public static listMethods (
        id: string
    ) : string[] {

        return ModuleMethod.list( `^${id}::` );

    }

}