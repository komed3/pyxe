'use strict';

import { assert } from '../services/ErrorUtils.js';

export abstract class Entity<Name extends string, Factory> {

    public static registry: any;
    public static instances: Map<string, any> = new Map ();

    public readonly name: Name;
    protected factory: Factory;

    public constructor (
        name: Name
    ) {

        const cls = this.constructor as typeof Entity & { registry: any };

        assert( cls.registry.has( name ), {
            method: 'Entity',
            msg: `Entry <${name}> not found in registry`
        } );

        this.name = name;
        this.factory = cls.registry.get( name )!;

    }

    public meta (
        key?: string
    ) : any {

        const meta = ( this.factory as any )?.meta ?? {};

        return key ? meta[ key ] : meta;

    }

    public static getInstance<
        T extends Entity<Name, Factory>,
        Name extends string,
        Factory
    > (
        this: {
            new ( name: Name ) : T;
            instances: Map<Name, T>;
            registry: any
        },
        name: Name,
        force: boolean = false
    ) : T {

        if ( force || ! this.instances.has( name ) ) {

            this.instances.set( name, new this ( name ) );

        }

        return this.instances.get( name )!;

    }

    public static destroyInstance<Name extends string> (
        this: { instances: Map<Name, any> },
        name: Name
    ) : void {

        this.instances.delete( name );

    }

    public static list<Name extends string> (
        this: { registry: any }
    ) : Name[] {

        return this.registry.list();

    }

    public static filter<Name extends string> (
        this: { registry: any },
        filter?: string
    ) : Name[] {

        return this.registry.filter( filter );

    }

    public static has<Name extends string> (
        this: { registry: any },
        name: Name,
        safe: boolean = false
    ) : boolean {

        return this.registry.has( name, safe );

    }

}