'use strict';

import type { ColorSpaceName, OutputFactory, OutputHandler } from '@pyxe/types';
import { Registry } from './Registry.js';
import { ColorMethodRegistry } from './ColorMethodRegistry.js';
import { hook } from '../services/Hook.js';
import { check } from '../services/ErrorUtils.js';

export class OutputRegistry extends Registry<ColorSpaceName, OutputFactory> {

    private boundMethods: Set<string> = new Set ();

    private _methodName (
        name: string
    ) : string {

        return hook.filter( 'OutputFactory::methodName', `to${ name.toUpperCase() }`, name, this );

    }

    public add (
        space: ColorSpaceName,
        type: string,
        handler: OutputHandler | string,
        update: boolean = true
    ) : void {

        hook.run( 'OutputRegistry::beforeAdd', space, type, handler, update, this );

        if ( ! this.has( space ) ) {

            this.items.set( space, {} );

        }

        this.items.get( space )![ type ] = handler;

        this.updateMethods( update );

        hook.run( 'OutputRegistry::afterAdd', space, type, handler, update, this );

    }

    public addMany (
        space: ColorSpaceName,
        factory: OutputFactory,
        update: boolean = true
    ) : void {

        hook.run( 'OutputRegistry::addMany', space, factory, update, this );

        for ( const [ type, handler ] of Object.entries( factory ) ) {

            this.add( space, type, handler, false );

        }

        this.updateMethods( update );

    }

    public remove (
        space: ColorSpaceName,
        type: string,
        update: boolean = true
    ) : void {

        hook.run( 'OutputRegistry::beforeRemove', space, type, update, this );

        const factory = this.items.get( space );

        if ( check( factory && type in factory, {
            method: 'OutputRegistry',
            msg: `Output handler <${type}> for color space <${space}> is not declared`
        }, false ) ) {

            delete factory![ type ];

            if ( Object.keys( factory! ).length ) {

                this.items.set( space, factory! );

            } else {

                this.removeAll( space );

            }

            this.updateMethods( update );

        }

        hook.run( 'OutputRegistry::afterRemove', space, type, update, this );

    }

    public removeAll (
        space: ColorSpaceName,
        update: boolean = true
    ) : void {

        hook.run( 'OutputRegistry::removeAll', space, update, this );

        this.items.delete( space );

        this.updateMethods( update );

    }

    public clear () : void {

        hook.run( 'OutputRegistry::clear', this );

        super._clear();

        this.updateMethods( true );

    }

    public updateMethods (
        update: boolean = true
    ) : void {

        if ( update ) {

            hook.run( 'OutputRegistry::beforeUpdateMethods', this );

            const prev = this.boundMethods;
            const curr = new Set ( [ ...this.all() ].flatMap( Object.keys ) );

            prev.forEach( ( method ) => ! curr.has( method ) && 
                ColorMethodRegistry.unbind( this._methodName( method ) )
            );

            curr.forEach( ( method ) => ! prev.has( method ) && 
                ColorMethodRegistry.bind(
                    method, this._methodName( method ),
                    ( self, method, string ) => self.to( method, string )
                )
            );

            this.boundMethods = curr;

            hook.run( 'OutputRegistry::afterUpdateMethods', this );

        }

    }

    public get (
        source: ColorSpaceName
    ) : OutputFactory {

        return super.get( source, false ) ?? {};

    }

    public methods (
        source: ColorSpaceName
    ) : ColorSpaceName[] {

        return (
            Object.keys( this.get( source ) )
        ) as ColorSpaceName[];

    }

}

export const outputRegistry = new OutputRegistry ();