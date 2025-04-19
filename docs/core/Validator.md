# Color Object Validator

The `Validator` class is a utility that enables standardized validation of color objects or instances for any registered color space within the `@pyxe/core` module. It leverages the central `ColorSpace` registry to access validator functions defined by individual color spaces.

Features are:

- delegates validation to space-specific handler functions registered in `ColorSpace`
- throws structured errors for invalid input in `safe mode`
- supports boolean validation checks without throwing
- ensures all `ColorObject` instances are well-formed and normalized

By encapsulating all validation logic in one place, the system remains consistent, extensible, and decoupled from specific implementations.

**This class cannot be instantiated. All methods are static.**

## Usage

Although the class is used at many internal spots to match the input with color space specifications, users may also find the class helpful in some scenarios and use it by importing it individually. However, the methods `Color.validate()` and `Color.instanceOf( <space> )` can also be used for an instantiated color.

```ts
import { Validator } from 'pyxe';

console.log( Validator.instanceOf( 'HEX', '#ff00ff' ) );
// Output: true

const color = { space: 'Lab', value: '#ff00ff' };

Validator.validate( color, true );
// will throw an error
```

## Methods

### `instanceOf( space, input )`

```ts
static instanceOf (
  space: ColorSpaceID,
  input: ColorInstance
) : boolean
```

Validates the given color instance against the specified color space using its registered validator.

@param `space` - The ID of the color space to validate against (e.g., `RGB`, `Lab`)  
@param `input` - The color instance to be validated  
@returns `true` if the input matches, `false` otherwise

### `validate( input )`

```ts
static validate (
  input: ColorObject,
  safe: boolean = false
) : boolean
```

Validates the input color object.

@param `input` - The color object to be validated  
@returns `true` if the input matches, `false` otherwise  
@throws If validation fails (`safe mode`) or the color space is unknown