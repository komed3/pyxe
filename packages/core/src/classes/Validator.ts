'use strict';

import type { ColorInstance, ColorObjectFactory } from '@pyxe/types';
import { ChannelHelper } from '@pyxe/utils';
import { ColorSpace } from './ColorSpace.js';
import { catchToError, handleError } from '../services/ErrorUtils.js';
import { hook } from '../services/Hook.js';

export class Validator {

    constructor (
        private safe: boolean = true
    ) {}

    public validate (
        factory: ColorObjectFactory,
        isNormalized?: boolean
    ) : boolean {

        return catchToError( () => {

            const colorSpace = ColorSpace.getInstance( factory.space ) as ColorSpace;
            const channels = colorSpace.channels();

            hook.run( 'Validator::validate', factory, isNormalized, colorSpace, this );

            /** check for matching color space */

            if ( factory.space !== colorSpace.name ) {

                return handleError( {
                    method: 'Validator',
                    msg: `Color space <${factory.space}> does not match <${colorSpace.name}>`
                }, this.safe );

            }

            /** check for unexpected channels */

            let keys = [];

            if ( ( keys = Object.keys( factory.value ).filter(
                ( k ) => ! channels.includes( k )
            ) ).length ) {

                return handleError( {
                    method: 'Validator',
                    msg: `Unexpected channel(s) <${ keys.join( ', ' ) }>`
                }, this.safe );

            }

            /** check for missing channels */

            if ( ( keys = Object.values( channels ).filter(
                ( k ) => ! ( k in factory.value )
            ) ).length ) {

                return handleError( {
                    method: 'Validator',
                    msg: `Missing channel(s) <${ keys.join( ', ' ) }>`
                }, this.safe );

            }

            /** check for invalid channel values */

            const result = ChannelHelper.instance( 'validate', factory.value, colorSpace.getChannels(), isNormalized );

            if ( ( keys = Object.keys( result ).filter(
                ( key ) => ! result[ key as keyof ColorInstance ]
            ) ).length ) {

                return handleError( {
                    method: 'Validator',
                    msg: `Invalid channel value(s) for <${ keys.join( ', ' ) }>`
                }, this.safe );

            }

            /** all validation steps passed */

            return hook.filter( 'Validator::passed', true, factory, isNormalized, colorSpace, this );

        }, {
            method: 'Validator',
            msg: `Validation failed`
        }, this.safe );

    }

}

export const validator = new Validator ();
export const test = new Validator ( false );