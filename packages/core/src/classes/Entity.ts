'use strict';

import { hook } from '../services/Hook.js';
import { assert } from '../services/ErrorUtils.js';

type EntityClass<T, Name> = {
    new ( name: Name ) : T;
    registry: {
        list () : Name[];
        filter ( filter?: string ) : Name[];
        all () : any;
        has ( name: Name, safe?: boolean ) : boolean;
        get ( name: Name, safe?: boolean ) : any;
    };
    instances: Map<string, T>;
};

export abstract class Entity<
    Name extends string,
    Factory = unknown
> {

    protected static instances: Map<string, any> = new Map ();
    protected static registry: any;

    public readonly name: Name;
    protected factory: Factory;

    private static get _entityClass () : EntityClass<any, any> {

        return this as unknown as EntityClass<any, any>;

    }

    protected constructor (
        name: Name
    ) {

        const cls = this.constructor as EntityClass<this, Name>;

        hook.run( 'Entity::constructor', cls, name, this );

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

    public static getInstance<T extends Entity<Name, any>, Name extends string> (
        name: Name,
        force = false
    ) : T {

        const cls = this as any;

        if ( force || ! cls.instances.has( name ) ) {

            cls.instances.set( name, new cls ( name ) );

        }

        return cls.instances.get( name )!;

    }

    public static destroyInstance<Name extends string> (
        this: { instances: Map<Name, any> },
        name: Name
    ) : void {

        this.instances.delete( name );

    }

    public static list<Name extends string> () : Name[] {

        return this._entityClass.registry.list() as Name[];

    }

    public static filter<Name extends string> (
        filter?: string
    ) : Name[] {

        return this._entityClass.registry.filter( filter );

    }

    public static has<Name extends string> (
        name: Name,
        safe: boolean = false
    ) : boolean {

        return this._entityClass.registry.has( name, safe );

    }

}