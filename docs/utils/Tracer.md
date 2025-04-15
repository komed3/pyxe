# Tracer Utility

The `Tracer` module provides a centralized mechanism for recording and inspecting metadata about operations performed on color objects within the `pyxe` framework. It is part of the `@pyxe/utils` package and designed to support **debugging**, **analysis**, and **runtime introspection** of transformations such as parsing, conversion, and color module calculations.

Tracing is disabled by default to ensure optimal performance. It must be explicitly enabled before any tracking information is collected.

Key features are:

- record timestamped trace entries attached to color objects
- entries contain contextual information about the operation (e.g., source, target, path)
- support flushing old trace data before adding new entries
- include ready-to-use templates for common actions: `parse`, `convert`, and `module`

## Usage

The tracer is used through the main `Utils` interface or by explicitly importing the tracer class.

In the following example, the tracer is used for various operations:

```ts
import { Color, Utils } from 'pyxe';

Utils.tracer.enable();

const color = new Color.parse( '#ff00ff' );
color.invert().convert( 'RGB' );

console.log( Utils.tracer.get( color ) );
```

Import the tracer directly using:

```ts
import { tracer, tracerTemplates } from '@pyxe/utils/tracer';
```

## Methods

### `_add( obj, entry [, flush = false ] )`

```ts
_add (
  obj: ColorObject,
  entry: Partial<TracerFactory>,
  flush = false
) : void
```

Internal method for adding a trace entry to a color object.

@param `obj` - The target color object to which the trace entry should be added  
@param `entry` - The trace entry describing the action performed  
@param `flush` - Whether to flush previous traces on the input object

### `_flush( obj )`

```ts
_flush (
  obj: ColorObject
) : void
```

Clears all trace entries from the given color object.

@param `obj` - The color object whose trace history should be cleared

### `enable()`

```ts
enable () : void
```

Enables the tracer globally. Required to activate tracing behavior.

### `disable()`

```ts
disable () : void
```

Disables the tracer globally. Further trace entries will not be recorded.

### `isReady()`

```ts
isReady () : boolean
```

Indicates whether tracing is currently enabled.

@returns `true` if tracing is enabled, `false` otherwise

### `get( obj )`

```ts
get (
  obj: ColorObject
) : TracerFactory[] | undefined
```

Retrieves the list of trace entries from a given color object.

@param `obj` - The color object containing trace metadata  
@returns An array of TracerFactory entries or undefined if none exist

## Singleton Export

```ts
export const tracer = new Tracer ();
```

This instance is used throughout the `pyxe` framework to trace color object conversion, parsing, applying module calculations and more.

## Templates

The `tracerTemplates` object provides helpers to create trace entries for common operations.

### `tracerTemplates.parse( input, result )`

Creates a trace entry for a parsing action.

@param `input` - The raw color input (string, object, etc.)  
@param `result` - The parsed `ColorObject`

### `tracerTemplates.convert( input, result [, path ] )`

Creates a trace entry for a color space conversion.

@param `input` - The original ColorObject  
@param `result` - The result after conversion  
@param `path` - Optional transformation steps or route

### `tracerTemplates.module( name, input, result )`

Creates a trace entry for a module-based transformation.

@param `name` - Module identifier (e.g., "invert", "lighten")  
@param `input` - The input color before transformation  
@param `result` - The output color after transformation