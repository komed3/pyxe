'use strict';

import { Services } from '@pyxe/core/services';

export const registry: Record<string, string[]> = {
    space: [
        'cmy', 'cmyk', 'hcg', 'hsi', 'hsl', 'hsv', 'hwb', 'lab', 'lrgb', 'rec709',
        'rec2020', 'rgb', 'xyy', 'xyz', 'ycbcr', 'ydbdr', 'yiq', 'ypbpr', 'yuv'
    ],
    library: [ 'ral' ],
    module: []
};

export const loaded: Map<string, string[]> = new Map ();

const loadPackages = async () : Promise<void> => {

    await Promise.all( Object.entries( registry ).map( async ( [ type, packages ] ) => {

        const loadedPackages = await Promise.all( packages.map( async ( name ) => {

            const pkg = `@pyxe/${type}-${name}`;

            try {

                /** try to import package */

                await import ( pkg );

                Services.Debugger.log( 'AutoLoader', `Package <${name}> of type <${type}> loaded` );

                Services.Hook.run( 'AutoLoader::init', pkg, type, name );

                return name;

            } catch {

                /** skip uninstalled package */

                Services.Hook.run( 'AutoLoader::skip', pkg, type, name );

                return undefined;

            }


        } ) );

        loaded.set( type, loadedPackages.filter(
            ( pkg ) : pkg is string => pkg !== undefined
        ) );

    } ) );

};

Services.Hook.run( 'AutoLoader::start', registry );

await loadPackages();

Services.Hook.run( 'AutoLoader::finish', registry, loaded );