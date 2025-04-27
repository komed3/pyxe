'use strict';

import type { ColorInput, ColorInstance, ColorObjectFactory, ColorSpaceName } from '@pyxe/types';
import { ChannelHelper } from '@pyxe/utils';
import { ColorSpace } from './ColorSpace.js';
import { hook } from '../services/Hook.js';
import { debug } from '../services/Debug.js';

const instances: Map<ColorSpaceName, Parser> = new Map ();

export class Parser {

    private colorSpace: ColorSpace;
    private regex: RegExp;

    private constructor (
        name: ColorSpaceName,
        readonly strict: boolean = false
    ) {

        this.colorSpace = ColorSpace.getInstance( name );

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
                ? '([\\d.]+(?:deg|°|)?+%?)'
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

        hook.run( 'Parser::beforeParse', input, this );

        const match = input.toString().trim().match( this.regex );

        if ( ! match || match.length < this.colorSpace.channels().length ) {

            debug.warn( 'Parser', `Input <${ JSON.stringify( input ) }> does not match color space <${this.colorSpace.space}>` );

            return false;

        }

        const channels: Record<string, number> = {};

        for ( const [ key, channel ] of Object.entries( this.colorSpace.getChannels() ) ) {

            const value = ChannelHelper.parse( match.shift(), channel, ! this.strict );

            if ( value === undefined || isNaN( value ) ) {

                debug.warn( 'Parser', `Missing or invalid value for channel <${key}>: ${value}` );

                return false;

            }

            channels[ key ] = value;

        }

        hook.run( 'Parser::afterParse', input, this );

        return hook.filter( 'Parser::color', {
            space: this.colorSpace.space,
            value: channels as Partial<ColorInstance>,
            alpha: ChannelHelper.parseAlpha( match.shift(), ! this.strict ),
            meta: { source: input }
        }, input, this ) as ColorObjectFactory;

    }

    public static getInstance (
        name: ColorSpaceName,
        strict: boolean = false,
        force: boolean = false
    ) : Parser {

        const resolved = ColorSpace.resolve( name );

        if (
            force || ! instances.has( resolved ) ||
            instances.get( resolved )?.strict != strict
        ) {

            instances.set( resolved, new Parser ( resolved, strict ) );

        }

        return instances.get( resolved )!;

    }

    public static destroyInstance (
        name: ColorSpaceName
    ) : void {

        instances.delete( ColorSpace.resolve( name ) );

    }

    public static parseAuto (
        input: ColorInput,
        strict: boolean = false
    ) : ColorObjectFactory | false {

        //

    }

}