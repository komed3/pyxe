# Pyxe Error Handling

The `PyxeError` class provides a consistent and developer-friendly way to raise, inspect, and log errors throughout the `pyxe` framework. It extends the native `Error` class with additional metadata and standardized formatting, making debugging and error tracing more intuitive.

Key features are:

- standardized error message formatting
- timestamped and method-tagged output
- optional nested error inspection (`Error | string | any`)
- built-in logging methods: `log`, `warn`, `info`
- selective inclusion of stack traces

## Output Format

All errors follow this format:

```js
<TIME> [<METHOD>] <MESSAGE>(: <EXTRA>)
<STACK TRACE (optional)>
```

This ensures that error messages are always immediately understandable and traceable, both in CLI and development environments.

## Usage

Error handling is used through the main `Utils` interface or by explicitly importing the `PyxeError` class.

In the following example, a custom error is thrown:

```ts
import { Utils } from '@pyxe/utils';

try { … } catch ( err ) {

  throw new Utils.error ( {
    err, method: 'Test',
    msg: 'Something has failed'
  } );

}
```

Optionally, the `pyxe` error environment can also be imported separately and the PyxeError class instantiated directly:

```ts
import { PyxeError } from '@pyxe/utils/error';

throw new PyxeError( { … } );
```

## Methods

### Instantiation: `construct( factory )`

```ts
constructor (
  factory: ErrorFactory
)
```

Constructs a new `PyxeError` instance using the given factory object.

@param `factory` - An object containing method name, optional message and inner error

### `toString( [ trace = true ] )`

```ts
toString (
  trace = true
) : string
```

Returns a formatted string representation of the error. Set `trace` to `false` to omit the stack trace.

@param `trace` - Whether to include the full stack trace (default: `true`)  
@returns A human-readable error message

### `log( [ trace = true ] )`

```ts
log (
  trace = true
) : void
```

Logs the error using `console.error()`. Includes stack trace by default.

@param `trace` - Whether to include the full stack trace (default: `true`)

### `warn( [ trace = false ] )`

```ts
warn (
  trace = false
) : void
```

Logs the error using `console.warn()`. Omits stack trace by default.

@param `trace` - Whether to include the stack trace (default: `false`)

### `info( [ trace = false ] )`

```ts
info (
  trace = false
) : void
```

Logs the error using `console.info()`. Omits stack trace by default.

@param `trace` - Whether to include the stack trace (default: `false`)