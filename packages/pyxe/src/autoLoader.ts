'use strict';

export const registry: Record<string, string[]> = {
    space: [ 'hex', 'rgb', 'hsl', 'hsv', 'cmyk' ],
    module: [ 'basic' ]
};

export const loaded: Map<string, string[]> = new Map ();

const loadPackages = async () : Promise<void> => {

    for ( const [ type, packages ] of Object.entries( registry ) ) {

        const loadedPackages = packages.map( async ( name ) => {

            try {

                await import( `@pyxe/${type}-${name}` );

                console.log( `[PYXE AUTO LOADER] package <${name}> of type <${type}> loaded` );

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