'use strict';

import type { ColorSpaceID, ConversionFactory, ConversionHandler } from '@pyxe/types';

export class ConversionGraphRegistry {

    private registry: Map<ColorSpaceID, ConversionFactory> = new Map ();

    public add (
        source: ColorSpaceID,
        target: ColorSpaceID,
        handler: ConversionHandler
    ) : void {

        if ( ! this.has( source ) ) {

            this.registry.set( source, {} );

        }

        this.registry.get( source )![ target ] = handler;

    }

    public addMany (
        source: ColorSpaceID,
        factory: ConversionFactory
    ) : void {

        for ( const [ target, handler ] of Object.entries( factory ) ) {

            this.add( source, target as ColorSpaceID, handler );

        }

    }

    public remove (
        source: ColorSpaceID,
        target: ColorSpaceID
    ) : void {

        const targets = this.getFrom( source );

        delete targets[ target ];

        if ( Object.keys( targets ).length ) {

            this.registry.set( source, targets );

        } else {

            this.removeAll( source );

        }

    }

    public removeAll (
        source: ColorSpaceID
    ) : void {

        this.registry.delete( source );

    }

    public list () : ColorSpaceID[] {

        return [ ...this.registry.keys() ];

    }

    public has (
        source: ColorSpaceID
    ) : boolean {

        return this.registry.has( source );

    }

    public getFrom (
        source: ColorSpaceID
    ) : ConversionFactory {

        return this.registry.get( source ) || {};

    }

    public getTargets (
        source: ColorSpaceID
    ) : ColorSpaceID[] {

        return Object.keys(
            this.getFrom( source )
        ) as ColorSpaceID[];

    }

}

export const conversionGraphRegistry = new ConversionGraphRegistry ();