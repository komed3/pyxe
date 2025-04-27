'use strict';

import type { ColorInput, ColorObjectFactory, ColorSpaceName } from '@pyxe/types';
import { ColorSpace } from './ColorSpace.js';
import { hook } from '../services/Hook.js';

const instances: Map<ColorSpaceName, Parser> = new Map ();

export class Parser {

    private colorSpace: ColorSpace;
    private regex: RegExp;

    private constructor (
        readonly space: ColorSpaceName
    ) {

        this.colorSpace = ColorSpace.getInstance( this.space );

        this.regex = new RegExp( this._buildRegex(), 'i' );

    }

    private _buildRegex () : string {

        /** color space name + aliases */
        const names = [ this.colorSpace.space, ...this.colorSpace.aliases() ]
            .map( name => name.replace( /[.*+?^${}()|[\]\\]/g, '\\$&' ).replace( /[-_]/g, '[-_]?' ) )
            .join( '|' );

        /** patterns for individual channels */
        const channels = Object.values( this.colorSpace.getChannels() ).map(
            ( channel ) => channel.type === 'cyclic'
                ? '([\\d.]+(?:deg|°)?)'
                : '([\\d.]+%?)'
        );

        /** expand alpha channel if supported */
        if ( this.colorSpace.alpha() ) channels.push( '([\\d.]+%?)' );

        /** flexible separators */
        const separator = '\\s*(?:[,/]|\\s)\\s*';

        /** create final search pattern */
        return hook.filter( 'Parser::regex', `^(?:${names})\\s*\\(?${ ( channels.map(
            ( c, i ) => i === channels.length - 1 ? `(?:${separator}${c})?` : i === 0 ? c : `${separator}${c}`
        ).join( '' ) ) }\\)?$`, this );

    }

    public parse (
        input: ColorInput
    ) : ColorObjectFactory | false {
        
        //

    }

    public static getInstance (
        space: ColorSpaceName,
        force: boolean = false
    ) : Parser {

        const resolved = ColorSpace.resolve( space );

        if ( force || ! instances.has( resolved ) ) {

            instances.set( resolved, new Parser ( resolved ) );

        }

        return instances.get( resolved )!;

    }

    public static destroyInstance (
        space: ColorSpaceName
    ) : void {

        instances.delete( ColorSpace.resolve( space ) );

    }

    public static parseAuto (
        input: ColorInput
    ) : ColorObjectFactory | false {

        //

    }

}