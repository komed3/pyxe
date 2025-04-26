'use strict';

import { ColorObjectFactory } from '@pyxe/types';
import { ChannelHelper } from '@pyxe/utils';
import { ColorSpace } from './ColorSpace.js';
import { hook } from '../services/Hook.js';
import { PyxeError } from '../services/PyxeError.js';

export class Validator {

    constructor (
        private safe: boolean = false
    ) {}

    private _handleError (
        message: string
    ) : false {

        const pyxeError = new PyxeError ( {
            method: 'Validator',
            msg: message
        } );

        if ( this.safe ) {

            throw pyxeError;

        } else {

            pyxeError.log();

        }

        return false;

    }

    public validate (
        factory: ColorObjectFactory
    ) : boolean {

        const colorSpace = ColorSpace.getInstance( factory.space );

        hook.run( 'Validator::validate', factory, colorSpace, this );

        for ( const [ key, channel ] of Object.entries( colorSpace.getChannels() ) ) {

            let value = factory.value[ key as keyof typeof factory.value ];

            if ( value === undefined ) {

                return this._handleError( `Missing channel <${key}> in color instance` );

            }

            if ( ! ChannelHelper.validate( value, channel ) ) {

                return this._handleError( `Invalid value for channel <${key}>: ${value}` );

            }

        }

        return true;

    }

}