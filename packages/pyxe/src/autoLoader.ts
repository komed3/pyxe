'use strict';

import { Services } from '@pyxe/core/services';

export const registry: Record<string, string[]> = {
    space: [ 'rgb', 'hsl', 'hsv' ],
    library: [],
    module: []
};

export const loaded: Map<string, string[]> = new Map ();

const loadPackages = async () : Promise<void> => {

    for ( const [ type, packages ] of Object.entries( registry ) ) {

        const loadedPackages = packages.map( async ( name ) => {

            try {

                await import( `@pyxe/${type}-${name}` );

                Services.Debugger.log( 'AutoLoader', `package <${name}> of type <${type}> loaded` );

                return name;

            } catch {

                /** Skip uninstalled package */

            }

        } );

        loaded.set( type,
            ( await Promise.all( loadedPackages ) ).filter(
                ( pkg ) : pkg is string => pkg !== undefined
            )
        );

    }

};

await loadPackages();