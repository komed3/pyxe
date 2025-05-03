'use strict';

import { Services } from '@pyxe/core/services';

export const registry: Record<string, string[]> = {
    space: [ 'rgb', 'hsl', 'hsv' ],
    library: [ 'ral' ],
    module: []
};

export const loaded: Map<string, string[]> = new Map ();

const loadPackages = async () : Promise<void> => {

    await Promise.all( Object.entries( registry ).map( async ( [ type, packages ] ) => {

        const loadedPackages = await Promise.all( packages.map( async ( name ) => {

            try {

                await import ( `@pyxe/${type}-${name}` );

                Services.Debugger.log( 'AutoLoader', `Package <${name}> of type <${type}> loaded` );

                return name;

            } catch {

                /** skip uninstalled package */
                return undefined;

            }


        } ) );

        loaded.set( type, loadedPackages.filter(
            ( pkg ) : pkg is string => pkg !== undefined
        ) );

    } ) );

};

await loadPackages();