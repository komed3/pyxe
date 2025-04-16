# Main Color Space Registry

The `ColorSpace` class manages internal registration and lookup of all color spaces supported by the `pyxe` framework. It serves as a central registry used by components such as parsers, conversion graphs, validators, and output modules.

Provides centralized color space management and internal APIs for registration and querying.

**This class is not intended for direct use by application developers but is essential for the infrastructure behind color space management.**

## Typical Workflow

The dynamic loading of color spaces allows `pyxe` to be extended modularly without having to make changes to its core.

**(1)** - A color space is defined using the `ColorSpaceFactory` interface.  
**(2)** - On load, it registers itself via `colorSpace._register( … )`.  
**(3)** - You can then use the color space throughout the framework.

## Color Space Factory

A new color space is defined by the `ColorSpaceFactory`, an interface consisting of rudimentary and mandatory specifications, including the ID of the color space (e.g. `HEX` or `RGB`), parser and validator handler functions and additional arguments, which include metadata as well as an array of supported color space conversions and ouput handlers.

```ts
interface ColorSpaceFactory {
  id: ColorSpaceID;
  validator: ValidatorHandler;
  parser: ParserHandler;
  conversions?: ConversionPath[];
  output?: Record<OutputTypes, OutputHandler>;
  meta?: Record<string, any>
}
```

## Methods

### `_register( id, factory )`

```ts
_register (
  id: ColorSpaceID,
  factory: ColorSpaceFactory
) : void
```

Registers a new color space that contains handler functions for validation, parsing, etc. and its conversions, stored in the `ColorSpaceFactory` object.

@param `id` - Unique identifier of the color space  
@param `factory` - Factory object implementing the color space definition  
@throws Error if the color space ID has already been registered

### `_unregister( id )`

```ts
_unregister (
  id: ColorSpaceID
) : void
```

Removes a previously registered color space and its associated conversions.

@param `id` - Color space ID to remove  
@throws Error if the color space does not exist

### `has( id )`

```ts
has (
  id: ColorSpaceID
) : boolean
```

Checks if a color space is registered.

@param `id` - The color space ID to look up  
@returns `true` if the color space is registered, `false` otherwise

### `check( id )`

```ts
check (
  id: ColorSpaceID
) : boolean
```

Ensures a color space is registered, or throws.

@param `id` - Color space ID to check  
@returns `true` if the color space exists  
@throws Error if the color space is not registered

### `get( id [, safe = true ] )`

```ts
get (
  id: ColorSpaceID,
  safe = true
) : ColorSpaceFactory | undefined
```

Retrieves a color space factory.

@param `id` - Color space ID to retrieve  
@param `safe` - Whether to throw an error if the space does not exist (default: `true`)  
@returns The factory if found, or `undefined` if `safe` is `false` and not found  
@throws Error if `safe` is `true` and the color space is not registered

### `getSpaces()`

```ts
getSpaces () : ColorSpaceID[]
```

Returns all registered color space identifiers.

### `getMeta( id )`

```ts
getMeta (
  id: ColorSpaceID
) : any
```

Returns metadata from a color space definition.

@param `id` - Color space ID  
@returns The `meta` field from the color space factory, if defined  
@throws Error if the color space is not registered

## Singleton Export

```ts
export const colorSpace = new ColorSpace ();
```

The singleton instance used throughout the `pyxe` framework. Used to register or query color spaces globally, especially for parsing, validating, color space conversion, etc.