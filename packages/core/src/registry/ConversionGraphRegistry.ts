'use strict';

import type { ColorSpaceName, ConversionHandler, ConversionFactory } from '@pyxe/types';
import { Registry } from './Registry.js';

export class ConversionGraphRegistry extends Registry<ColorSpaceName, ConversionFactory> {

    public add (
        source: ColorSpaceName,
        target: ColorSpaceName,
        handler: ConversionHandler
    ) : void {

        if ( ! this.has( source ) ) {

            this.items.set( source, {} );

        }

        this.items.get( source )![ target ] = handler;

    }

    public addMany (
        source: ColorSpaceName,
        factory: ConversionFactory
    ) : void {

        for ( const [ target, handler ] of Object.entries( factory ) ) {

            this.add( source, target as ColorSpaceName, handler as ConversionHandler );

        }

    }

    public remove (
        source: ColorSpaceName,
        target: ColorSpaceName
    ) : void {

        const targets = this.get( source );

        delete targets![ target ];

        if ( Object.keys( targets! ).length ) {

            this.items.set( source, targets! );

        } else {

            this.removeAll( source );

        }

    }

    public removeAll (
        source: ColorSpaceName
    ) : void {

        this.items.delete( source );

    }

    public clear () : void {

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

        return Object.keys( this.get( source ) ) as ColorSpaceName[];

    }

}

export const conversionGraphRegistry = new ConversionGraphRegistry ();