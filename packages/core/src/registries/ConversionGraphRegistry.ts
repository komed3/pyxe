'use strict';

import type { ColorSpaceName, ConversionHandler, ConversionFactory } from '@pyxe/types';
import { Registry } from './Registry.js';
import { hook } from '../services/Hook.js';
import { check } from '../services/ErrorUtils.js';

export class ConversionGraphRegistry extends Registry<ColorSpaceName, ConversionFactory> {

    public add (
        source: ColorSpaceName,
        target: ColorSpaceName,
        handler: ConversionHandler
    ) : void {

        hook.run( 'ConversionGraphRegistry::beforeAdd', source, target, handler, this );

        if ( ! this.items.has( source ) ) {

            this.items.set( source, {} );

        }

        this.items.get( source )![ target ] = handler;

        hook.run( 'ConversionGraphRegistry::afterAdd', source, target, handler, this );

    }

    public addMany (
        source: ColorSpaceName,
        factory: ConversionFactory
    ) : void {

        hook.run( 'ConversionGraphRegistry::addMany', source, factory, this );

        for ( const [ target, handler ] of Object.entries( factory ) ) {

            this.add( source, target, handler );

        }

    }

    public remove (
        source: ColorSpaceName,
        target: ColorSpaceName
    ) : void {

        hook.run( 'ConversionGraphRegistry::beforeRemove', source, target, this );

        const targets = this.get( source );

        if ( check( targets && target in targets, {
            method: 'ConversionGraphRegistry',
            msg: `Conversion from <${source}> to <${target}> is not declared`
        }, false ) ) {

            delete targets![ target ];

            if ( Object.keys( targets! ).length ) {

                this.items.set( source, targets! );

            } else {

                this.removeAll( source );

            }

        }

        hook.run( 'ConversionGraphRegistry::afterRemove', source, target, this );

    }

    public removeAll (
        source: ColorSpaceName
    ) : void {

        hook.run( 'ConversionGraphRegistry::removeAll', source, this );

        this.items.delete( source );

    }

    public clear () : void {

        hook.run( 'ConversionGraphRegistry::clear', this );

        super._clear();

    }

    public get (
        source: ColorSpaceName
    ) : ConversionFactory {

        return super.get( source, false ) ?? {};

    }

    public targets (
        source: ColorSpaceName
    ) : ColorSpaceName[] {

        return (
            Object.keys( this.get( source ) )
        ) as ColorSpaceName[];

    }

}

export const conversionGraphRegistry = new ConversionGraphRegistry ();