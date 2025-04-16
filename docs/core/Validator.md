# Color Object Validator

The `Validator` class is a utility that enables standardized validation of color objects or instances for any registered color space within the `@pyxe/core` module. It leverages the central `ColorSpace` registry to access validator functions defined by individual color spaces.

Features are:

- delegates validation to space-specific handler functions registered in `ColorSpace`
- throws structured errors for invalid input
- supports boolean validation checks without throwing
- ensures all `ColorObject` instances are well-formed and normalized

By encapsulating all validation logic in one place, the system remains consistent, extensible, and decoupled from specific implementations.

**This class cannot be instantiated. All methods are static.**

## Usage

Although the class is used at many internal spots to match the input with color space specifications, users may also find the class helpful in some scenarios and use it by importing it individually. However, the methods `Color.validate()` and `Color.instanceOf( <space> )` can also be used for an instantiated color.

```ts
import { Validator } from 'pyxe';

const color = { space: 'HEX', value: '#ff00ff' };

console.log( Validator.try( color ) );

Validator.instanceOf( 'RGB', color.value );
// will throw an error
```

## Methods

### `instanceOf( space, input )`

```ts
static instanceOf (
  space: ColorSpaceID,
  input: ColorInstance
) : ColorObject
```

Validates the given color instance against the specified color space using its registered validator.

@param `space` - The ID of the color space to validate against (e.g., `'RGB'`, `'Lab'`)  
@param `input` - The raw color instance to be validated  
@returns A validated `ColorObject` representing the input  
@throws If validation fails or the color space is unknown

### `validate( input )`

```ts
static validate (
  input: ColorObject
) : ColorObject
```

Validates the input color object.

@param `input` - The color object to be validated  
@returns A validated `ColorObject` representing the input  
@throws If validation fails or the color space is unknown

### `try( input )`

```ts
static try (
  input: ColorObject
) : boolean
```

Performs a non-throwing validation test. Returns a boolean indicating whether the input would pass validation.

@param `input` - The color object to be validated  
@return `true` if validation is successful, `false` if not