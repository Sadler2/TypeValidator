// Define test cases
const testCases = [
    // Test string type validation

    { paramName: 'testString', paramValue: 'hello', expectedType: 'string', expectedResult: true },
    { paramName: 'testString', paramValue: 123, expectedType: 'string', expectedResult: false },
    { paramName: 'testString', paramValue: 'hello', expectedType: '"hello"', expectedResult: true },

    // Test number type validation
    { paramName: 'testNumber', paramValue: 123, expectedType: 'number', expectedResult: true },
    { paramName: 'testNumber', paramValue: '123', expectedType: 'number', expectedResult: false },
    { paramName: 'testNumber', paramValue: 123, expectedType: '123', expectedResult: true },

    // Test object type validation
    { paramName: 'testObject', paramValue: { prop: 'value' }, expectedType: 'object', expectedResult: true },
    { paramName: 'testObject', paramValue: 'not an object', expectedType: 'object', expectedResult: false },
    { paramName: 'testObject', paramValue: { prop: 'value' }, expectedType: { prop: 'string' }, expectedResult: true },

    // Test array type validation
    { paramName: 'testArray', paramValue: [1, 2, 3], expectedType: 'array', expectedResult: true },
    { paramName: 'testArray', paramValue: 'not an array', expectedType: 'array', expectedResult: false },
    { paramName: 'testArray', paramValue: [1, 2, 3], expectedType: ['number', 'number', 'number'], expectedResult: true },

    // Test constant value validation
    { paramName: 'testConstant', paramValue: 'hello', expectedType: '"hello"', expectedResult: true },
    { paramName: 'testConstant', paramValue: 'world', expectedType: '"hello"', expectedResult: false },
    { paramName: 'testConstant', paramValue: 123, expectedType: '123', expectedResult: true },

    // Test combination type validation
    { paramName: 'testUnion', paramValue: 123, expectedType: 'number|string', expectedResult: true },
    { paramName: 'testUnion', paramValue: true, expectedType: 'number|string', expectedResult: false },

    // Test complex object type validation
    { paramName: 'testComplexObject', paramValue: { prop1: 'value1', prop2: { nestedProp: 'nestedValue' } }, expectedType: { prop1: 'string', prop2: { nestedProp: 'string' } }, expectedResult: true },
    { paramName: 'testComplexObject', paramValue: { prop1: 'value1', prop2: { nestedProp: 123 } }, expectedType: { prop1: 'string', prop2: { nestedProp: 'string' } }, expectedResult: false },

    // Test complex array type validation
    { paramName: 'testComplexArray', paramValue: [[1, 2], [3, 4]], expectedType: ['[number]', '[number]'], expectedResult: true },
    { paramName: 'testComplexArray', paramValue: [[1, 2], [3, '4']], expectedType: ['[number]', '[number]'], expectedResult: false },

    // Test undefined value validation
    { paramName: 'testUndefined', paramValue: undefined, expectedType: 'undefined', expectedResult: true },
    { paramName: 'testUndefined', paramValue: 'defined', expectedType: 'undefined', expectedResult: false },

    // Test invalid type validation
    { paramName: 'testInvalidType', paramValue: 'value', expectedType: 'invalidType', expectedResult: false },
    { paramName: 'testEmptyType', paramValue: 'value', expectedType: '', expectedResult: false },

    { paramName: 'testOrEscape', paramValue: '|', expectedType: `'|'|number`, expectedResult: true },
];

const testCases2 = [
    // Basic Type Validation
    { paramName: 'String type validation', paramValue: 'Hello, world!', expectedType: 'string', expectedResult: true },
    { paramName: 'Number type validation', paramValue: 42, expectedType: 'number', expectedResult: true },
    { paramName: 'Boolean type validation', paramValue: false, expectedType: 'boolean', expectedResult: true },
    { paramName: 'Undefined type validation', paramValue: undefined, expectedType: 'undefined', expectedResult: true },
    { paramName: 'Null type validation', paramValue: null, expectedType: 'null', expectedResult: true },
    { paramName: 'Incorrect type validation', paramValue: 'string', expectedType: 'number', expectedResult: false },

    // Complex Types and Nested Structures
    { paramName: 'Array type validation', paramValue: [1, 2, 3], expectedType: 'array', expectedResult: true },
    { paramName: 'Object type validation', paramValue: { key: 'value' }, expectedType: 'object', expectedResult: true },
    { paramName: 'Nested array validation', paramValue: [[1, 2], [3, 4]], expectedType: '[[number]]', expectedResult: true },
    { paramName: 'Nested object validation', paramValue: { person: { name: 'John', age: 30 } }, expectedType: { person: { name: 'string', age: 'number' } }, expectedResult: true },

    // Special Types (any, optional types with ?, negation with !)
    { paramName: 'Any type validation', paramValue: 'anything', expectedType: 'any', expectedResult: true },
    { paramName: 'Optional string type validation (present)', paramValue: 'hello', expectedType: 'string?', expectedResult: true },
    { paramName: 'Optional string type validation (null)', paramValue: null, expectedType: 'string?', expectedResult: true },
    { paramName: 'Negation type validation (not a string)', paramValue: 100, expectedType: '!string', expectedResult: true },
    { paramName: 'Negation type validation (is a string)', paramValue: 'I am a string', expectedType: '!string', expectedResult: false },

    // Literal Types
    { paramName: 'Literal string validation', paramValue: 'specific', expectedType: '"specific"', expectedResult: true },
    { paramName: 'Literal number validation', paramValue: 42, expectedType: '42', expectedResult: true },
    { paramName: 'Incorrect literal string validation', paramValue: 'general', expectedType: '"specific"', expectedResult: false },

    // Compound Types
    { paramName: 'Union type validation (first type)', paramValue: 'hello', expectedType: 'string|number', expectedResult: true },
    { paramName: 'Union type validation (second type)', paramValue: 123, expectedType: 'string|number', expectedResult: true },
    { paramName: 'Union type validation (non-matching type)', paramValue: false, expectedType: 'string|number', expectedResult: false },

    // Escaping and Special Characters
    { paramName: 'Escaping special characters', paramValue: '"aaa"', expectedType: '""aaa""', expectedResult: true },

    // Errors and Edge Cases
    { paramName: 'Invalid input (undefined)', paramValue: undefined, expectedType: 'string', expectedResult: false },
    { paramName: 'Invalid structure definition', paramValue: { key: 'value' }, expectedType: "{ key: 'string'", expectedResult: false }, // Missing closing brace
];

const advancedTestCases = [
    {
        paramName: 'testComplexObjectUnion',
        paramValue: {
            prop1: 'value1',
            prop2: {
                nestedProp: ['nestedValue']
            }
        },
        expectedType: {
            prop1: 'string',
            prop2: {
                nestedProp: 'string|array'
            }
        },
        expectedResult: true
    },
    {
        paramName: 'testArrayOfObjectsVaryingProps',
        paramValue: [{ name: 'John' }, { age: 30 }],
        expectedType: [{ name: "string?" }, { age: "number?" }],
        expectedResult: true
    },
    {
        paramName: 'testUnionArrayObject',
        paramValue: [{ name: 'John' }, ['a', 'b']],
        expectedType: 'array|object',
        expectedResult: true
    },
    {
        paramName: 'testMultipleNestedProperties',
        paramValue: {
            prop1: { nested1: 'value1', nested2: 123 },
            prop2: { nested1: 'value2', nested2: 'value3' }
        },
        expectedType: {
            prop1: { nested1: 'string', nested2: 'number' },
            prop2: { nested1: 'string', nested2: 'string' }
        },
        expectedResult: true
    },
    {
        paramName: 'testOptionalProperties',
        paramValue: {
            prop1: 'value1',
            prop2: 123,
            prop3: true
        },
        expectedType: { prop1: "string", prop2: "number?" },
        expectedResult: true
    },

    {
        paramName: 'testInverseProperties',
        paramValue: {
            prop1: 'value1',
            prop2: 123
        },
        expectedType: { prop1: "!number", prop2: "number?" },
        expectedResult: true
    },


];

const cases = [

    {
        paramName: 'arrayOfObjects',
        paramValue: [{ name: ['John'], age: 30 }, { name: ['Jane'], age: 25 }],
        expectedType: `[{ name: '[string]', age: 'number' }]`,
        expectedResult: true
    },

    {
        paramName: 'escaping',
        paramValue: '"aaa"',
        expectedType: `""aaa""`,
        expectedResult: true
    },

    // Array with Exact Length Constraint
    {
        paramName: 'exactLengthArray',
        paramValue: [1, 2, 3, 4, 5],
        expectedType: 'array<number>{5}',
        expectedResult: true
    },

    // Array with Minimum Length Constraint
    {
        paramName: 'minLengthArray',
        paramValue: ['a', 'b', 'c'],
        expectedType: 'array<string>{3,}',
        expectedResult: true
    },

    // Array with Maximum Length Constraint
    {
        paramName: 'maxLengthArray',
        paramValue: [true, false],
        expectedType: 'array<boolean>{,2}',
        expectedResult: true
    },

    // Array with Maximum Length Constraint
    {
        paramName: 'maxLengthArray fail',
        paramValue: [true, false, false],
        expectedType: 'array<boolean>{,2}',
        expectedResult: false
    },


    // Array with Range Length Constraint
    {
        paramName: 'rangeLengthArray',
        paramValue: ['John', 'Jane', 'Doe'],
        expectedType: 'array<string>{2,4}',
        expectedResult: true
    },

    // Number with Minimum Constraint
    {
        paramName: 'minNumber',
        paramValue: 10,
        expectedType: 'number{10,}',
        expectedResult: true
    },

    // Number with Maximum Constraint
    {
        paramName: 'maxNumber',
        paramValue: 50,
        expectedType: 'number{,50}',
        expectedResult: true
    },

    // Number with Range Constraint
    {
        paramName: 'rangeNumber',
        paramValue: 25,
        expectedType: 'number{20,30}',
        expectedResult: true
    },

    // Number with Range Constraint
    {
        paramName: 'rangeNumber fail',
        paramValue: 31,
        expectedType: 'number{20,30}',
        expectedResult: false
    },

    // Exact Number Constraint
    {
        paramName: 'exactNumber',
        paramValue: 42,
        expectedType: 'number{42,42}',
        expectedResult: true
    },

    {
        paramName: 'stringWithPattern',
        paramValue: "hello",
        expectedType: `string{/he[l]+o/}`,
        expectedResult: true
    },

    {
        paramName: 'wrongCase1',
        paramValue: "2",
        expectedType: `"1"|"2"|"3"`,
        expectedResult: true
    },

];


// Run the tests
[...cases, ...testCases, ...testCases2, ...advancedTestCases].forEach(testCase => {
    try {
        const result = TypeValidator.isType(testCase.paramValue, testCase.expectedType);
        if (result !== testCase.expectedResult) {
            console.log(`Testing ${testCase.paramName} with value ${JSON.stringify(testCase.paramValue)} against expected type ${testCase.expectedType}:`);
            console.log(`  Result: ${result === testCase.expectedResult ? 'Pass' : 'Fail'} (${result})`);
        }
    } catch (error) {
        console.log(`  Error: ${error.message}`);
    }
});
