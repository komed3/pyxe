'use strict';

import { ColorInstance, ColorObjectFactory } from '@pyxe/types';
import { ChannelHelper } from '@pyxe/utils';
import { ColorSpace } from './ColorSpace.js';
import { hook } from '../services/Hook.js';
import { check } from '../services/ErrorUtils.js';

export class Validator {

    constructor (
        private safe: boolean = false
    ) {}

    public validate (
        factory: ColorObjectFactory
    ) : boolean {

        const colorSpace = ColorSpace.getInstance( factory.space );

        hook.run( 'Validator::validate', factory, colorSpace, this );

        for ( const [ key, channel ] of Object.entries( colorSpace.getChannels() ) ) {

            const value = factory.value?.[ key as keyof ColorInstance ];

            if ( ! (

                check( value !== undefined, {
                    method: 'Validator',
                    msg: `Missing channel <${key}> in color instance`
                }, this.safe )

                ||

                check( ChannelHelper.validate( value, channel ), {
                    method: 'Validator',
                    msg: `Invalid value for channel <${key}>: ${value}`
                }, this.safe )

            ) ) {

                return false;

            }

        }

        return true;

    }

}

export const validator = new Validator ( true );
export const test = new Validator ( false );