'use strict';

import { ColorObjectFactory } from '@pyxe/types';
import { ChannelHelper } from '@pyxe/utils';
import { ColorSpace } from './ColorSpace.js';
import { hook } from '../services/Hook.js';
import { handleError } from '../services/ErrorUtils.js';

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

            let value = factory.value[ key as keyof typeof factory.value ];

            if ( value === undefined ) {

                return handleError( {
                    method: 'Validator',
                    msg: `Missing channel <${key}> in color instance`
                } );

            }

            if ( ! ChannelHelper.validate( value, channel ) ) {

                return handleError( {
                    method: 'Validator',
                    msg: `Invalid value for channel <${key}>: ${value}`
                } );

            }

        }

        return true;

    }

}