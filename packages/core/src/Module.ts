'use strict';

import { ModuleMethod } from './ModuleMethod.js';
import { moduleRegistry } from './registry/ModuleRegistry.js';
import { PyxeError } from './services/PyxeError.js';

export class Module {

    public static list () : string[] {

        return moduleRegistry.list();

    }

    public static has (
        name: string
    ) : boolean {

        return moduleRegistry.has( name );

    }

    public static check (
        name: string
    ) : true | undefined {

        if ( ! this.has( name ) ) {

            throw new PyxeError ( {
                method: 'Module',
                msg: `Module <${name}> is not declared`
            } );

        }

        return true;

    }

    public static meta (
        name: string
    ) : any {

        return moduleRegistry.get( name )?.meta;

    }

    public static listMethods (
        name: string
    ) : string[] {

        return ModuleMethod.list( `^${name}::` );

    }

}