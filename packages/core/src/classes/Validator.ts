'use strict';

import type { ColorInstance, ColorObjectFactory } from '@pyxe/types';
import { ChannelHelper } from '@pyxe/utils';
import { ColorSpace } from './ColorSpace.js';
import { hook } from '../services/Hook.js';
import { check } from '../services/ErrorUtils.js';

export class Validator {

    constructor (
        private safe: boolean = true
    ) {}

    public validate (
        factory: ColorObjectFactory
    ) : boolean {

        const value: ColorInstance = factory.value ?? {};
        const colorSpace = ColorSpace.getInstance( factory.space ) as ColorSpace;
        const channels = colorSpace.channels();

        hook.run( 'Validator::validate', factory, value, colorSpace, channels, this );

        const extraKeys = Object.keys( value ).filter(
            ( k ) => ! channels.includes( k )
        );

        /** check for unexpected channel(s) */
        if ( ! check( extraKeys.length === 0, {
            method: 'Validator',
            msg: `Unexpected channel(s) <${ extraKeys.join( ', ' ) }>`
        }, this.safe ) ) return false;

        for ( const [ key, channel ] of Object.entries( colorSpace.getChannels() ) ) {

            /** check for missing channel in color instance */
            if( ! check( key in value, {
                method: 'Validator',
                msg: `Missing channel <${key}> in color instance`
            }, this.safe ) ) return false;

            /** check for invalid channel value */
            if( ! check( ChannelHelper.validate( value[ key as keyof ColorInstance ], channel ), {
                method: 'Validator',
                msg: `Invalid value for channel <${key}>: ${ value[ key as keyof ColorInstance ] }`
            }, this.safe ) ) return false;

        }

        return true;

    }

}

export const validator = new Validator ();
export const test = new Validator ( false );