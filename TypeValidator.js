const TypeValidator = (function () {
    function validateArrayLength(arr, type) {
        // Check for range specification, e.g., {3,} or {,10} or {5,5}
        const rangeStart = type.indexOf('{');
        const rangeEnd = type.indexOf('}', rangeStart);
        if (rangeStart !== -1 && rangeEnd !== -1) {
            const rangeStr = type.substring(rangeStart + 1, rangeEnd)
            if (rangeStr.indexOf(',') === -1) return arr.length === Number(rangeStr)
            const rangeSpec = rangeStr.split(',');
            const min = rangeSpec[0] ? parseInt(rangeSpec[0], 10) : 0;
            const max = rangeSpec[1] ? parseInt(rangeSpec[1], 10) : Infinity;
            return arr.length >= min && arr.length <= max;
        }

        return true; // No length constraint detected.
    }


    function splitByDelimiter(str, delimiter) {
        const result = [];
        let currentElement = '';
        let isConstantString = false;
        let constantStringChar = '';

        for (let i = 0; i < str.length; i++) {
            const char = str[i];

            if (isConstantString) {
                if (char === constantStringChar) {
                    isConstantString = false;
                }
                currentElement += char;
            } else {
                if (char === '"' || char === "'") {
                    isConstantString = true;
                    constantStringChar = char;
                    currentElement += char;
                } else if (char === delimiter) {
                    result.push(currentElement);
                    currentElement = '';
                } else {
                    currentElement += char;
                }
            }
        }

        if (currentElement !== '') {
            result.push(currentElement);
        }

        return result;
    }

    function isType(value, type) {
        if (typeof type === 'string') {
            if (type.startsWith('!')) {
                const invertedType = type.slice(1);
                return ![null, undefined].includes(value) && !isType(value, invertedType);
            }
            if (type.endsWith('?')) {
                const baseType = type.slice(0, -1);
                return value === undefined || value === null || isType(value, baseType);
            }
            if (type === 'any') return true;
            if (type === 'null') return value === null;
            if (type === 'object') return typeof value === 'object' && value !== null;
            if (type === 'array') return Array.isArray(value);

            if (type.startsWith('string{/') && type.endsWith('/}')) {
                if (typeof value !== 'string') return false; // Ensure value is a string
                const regexPattern = type.slice(8, -2); // Extract the regex pattern
                const regex = new RegExp(regexPattern);
                return regex.test(value);
            }

            if (type.startsWith('array<') && type.includes('{') && type.includes('}')) {
                const elementTypeEndIndex = type.indexOf('>');
                const elementType = type.substring(6, elementTypeEndIndex);
                const baseType = elementType; // No need to remove range specification here

                if (!Array.isArray(value)) return false;
                // Extract and validate array length constraints using the helper function
                if (!validateArrayLength(value, type.substring(elementTypeEndIndex + 1))) return false;
                return value.every(item => isType(item, baseType));
            }

            if (type.startsWith('"') && type.endsWith('"')) return value === type.slice(1, -1);
            if (type.startsWith('\'') && type.endsWith('\'')) return value === type.slice(1, -1);

            if (type.startsWith('number{') && type.endsWith('}')) {
                const [min, max] = type.slice(7, -1).split(',').map(n => n.trim() ? parseInt(n, 10) : n);
                const minValue = min === '' ? -Infinity : min;
                const maxValue = max === '' ? Infinity : max;
                return typeof value === 'number' && value >= minValue && value <= maxValue;
            }

            if (!Number.isNaN(Number(value)) && !Number.isNaN(Number(type))) return Number(value) === Number(type);

            if (type.startsWith('[') && type.endsWith(']')) {
                const elementType = type.slice(1, -1);
                return Array.isArray(value) && value.every(item => {
                    const result = isType(item, elementType.trim());
                    return result;
                });
            }
            if (type.startsWith('{') && type.endsWith('}')) {
                const subTypes = splitByDelimiter(type.slice(1, -1), ',');
                return typeof value === 'object' && value !== null && subTypes.every(subType => {
                    let [key, valueType] = splitByDelimiter(subType.trim(), ':');
                    valueType = valueType.trim();
                    if (valueType.startsWith('\'') && valueType.endsWith('\'')) valueType = valueType.slice(1, -1);
                    if (valueType.startsWith('"') && valueType.endsWith('"')) valueType = valueType.slice(1, -1);

                    const result = value.hasOwnProperty(key.trim()) && isType(value[key.trim()], valueType.trim());
                    return result;
                });
            }

            const types = splitByDelimiter(type, '|');

            if (types.length > 1) {
                for (const t of types) {
                    if (isType(value, t.trim())) {
                        return true;
                    }
                }
            }

            return typeof value === type;
        } else if (typeof type === 'object') {
            if (Array.isArray(type)) return Array.isArray(value) && value.every((item, index) => isType(item, type[index]));
            return typeof value === 'object' && value !== null && Object.keys(type).every(key => isType(value[key], type[key]));
        }
        return false;
    }

    /**
     * Validates parameter types against expected types and throws an error if not valid.
     *
     * @param {Object.<string, string|Object|Array>} params - An object containing parameter names and their expected types.
     * @param {Object} args - An object containing parameter names and their values.
     * @returns {void} Throws an error if any parameter has an unexpected type.
     */
    function validateAndThrow(params, args) {
        for (const paramName in params) {
            if (params.hasOwnProperty(paramName)) {
                const expectedType = params[paramName];
                const argValue = args[paramName];

                if (!isType(argValue, expectedType)) {
                    throw new Error(`${paramName} must be of type ${expectedType}.`);
                }
            }
        }
    }

    /**
     * Validates the types of given arguments against specified expected types. This function is designed
     * to ensure that each argument provided matches the expected type, enhancing type safety in
     * dynamically typed environments. It supports complex type definitions, including nested objects
     * and arrays with specific type elements.
     *
     * @param {Object.<string, string>} params - An object mapping parameter names to their expected types.
     *        The expected type is expressed as a string, which may define simple types (e.g., 'string', 'number'),
     *        complex types (e.g., 'array<number>', 'object'), or custom validations.
     * @param {Object} args - An object mapping parameter names to their actual values. These are the values
     *        to be validated against the expected types defined in `params`.
     * @returns {Object} An object representing the validation result. This object includes a `success` boolean
     *          indicating whether all parameters passed validation, and an `errors` array. Each item in the
     *          `errors` array is an object detailing the parameter that failed validation, including the parameter
     *          name (`param`), the expected type (`expectedType`), and the received value (`receivedValue`).
     *          If all parameters pass validation, `success` is true and `errors` is an empty array.
     */
    function validate(params, args) {
        const validationResult = {
            success: true,
            errors: []
        };

        for (const paramName in params) {
            if (params.hasOwnProperty(paramName)) {
                const expectedType = params[paramName];
                const argValue = args[paramName];

                if (!isType(argValue, expectedType)) {
                    validationResult.success = false;
                    validationResult.errors.push({
                        param: paramName,
                        expectedType: expectedType,
                        receivedValue: argValue
                    });
                }
            }
        }

        return validationResult;
    }

    return {
        isType,
        validate,
        validateAndThrow
    }
})();

