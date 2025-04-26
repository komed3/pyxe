'use strict';

import { ColorObjectFactory } from '@pyxe/types';
import { ChannelHelper } from '@pyxe/utils';
import { ColorSpace } from './ColorSpace.js';
import { PyxeError } from '../services/PyxeError.js';

export class Validator {

    constructor (
        private safe: boolean = false
    ) {}

    private _handleError (
        message: string
    ) : false | undefined {

        if ( this.safe ) {

            throw new PyxeError ( {
                method: 'Validator',
                msg: message
            } );

        }

        return false;

    }

    public validate (
        factory: ColorObjectFactory
    ) : boolean {

        const colorSpace = ColorSpace.getInstance( factory.space );

        for ( const [ key, channel ] of Object.entries( colorSpace.getChannels() ) ) {

            let value = factory.value[ key as keyof typeof factory.value ];

            if ( value === undefined ) {

                this._handleError( `Missing channel <${key}> in color instance` );

            }

            if ( ! ChannelHelper.validate( value, channel ) ) {

                this._handleError( `Invalid value for channel <${key}>: ${value}` );

            }

        }

        return true;

    }

}