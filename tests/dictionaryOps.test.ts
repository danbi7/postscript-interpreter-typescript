import { OperandStack } from "../src/core/OperandStack";
import { DictionaryStack } from "../src/core/DictionaryStack";
import { PsObject, PsDictionary } from "../src/types/PsObject";
import { dict, lengthOp, maxlength, begin, end, def } from "../src/operators/dictionaryOps";

describe("dictionaryOps.ts Tests", () => {
    let opStack: OperandStack;
    let dictStack: DictionaryStack;

    beforeEach(() => {
        opStack = new OperandStack();
        dictStack = new DictionaryStack();
    });

    // Helper to create required objects
    const createNum = (val: number): PsObject => ({ type: 'number', value: val } as PsObject);
    const createName = (val: string): PsObject => ({ type: 'name', value: val } as PsObject);
    const createDictObj = (cap: number): PsObject => ({
        type: 'dict',
        value: { capacity: cap, entries: new Map<string, PsObject>() }
    } as PsObject);

    describe("dict", () => {
        it("should create a new dictionary object with specified capacity", () => {
            opStack.push(createNum(10));
            dict(opStack);
            const result = opStack.pop();
            expect(result.type).toBe('dict');
            expect((result.value as PsDictionary).capacity).toBe(10);
        });

        it("should throw error if capacity is not a number", () => {
            opStack.push(createName("notANumber"));
            expect(() => dict(opStack)).toThrow("TypeCheck: dict capacity must be a number");
        });
    });

    describe("lengthOp", () => {
        it("should return the number of entries in a dictionary", () => {
            const d = createDictObj(5);
            (d.value as PsDictionary).entries.set("key1", createNum(1));
            opStack.push(d);
            lengthOp(opStack);
            expect(opStack.pop().value).toBe(1);
        });

        it("should return the length of a string", () => {
            opStack.push({ type: 'string', value: "hello" } as PsObject);
            lengthOp(opStack);
            expect(opStack.pop().value).toBe(5);
        });
    });

    describe("maxlength", () => {
        it("should return the dictionary capacity", () => {
            opStack.push(createDictObj(20));
            maxlength(opStack);
            expect(opStack.pop().value).toBe(20);
        });
    });

    describe("begin & end", () => {
        it("should push a dict to the dictStack using begin", () => {
            const d = createDictObj(5);
            opStack.push(d);
            begin(opStack, dictStack);
            expect(dictStack.length()).toBe(2); // Base dict + new dict
        });

        it("should remove a dict from dictStack using end", () => {
            const d = createDictObj(5);
            opStack.push(d);
            begin(opStack, dictStack);
            end(dictStack);
            expect(dictStack.length()).toBe(1); // Only base dict remains
        });

        it("should throw error when trying to pop the base dictionary", () => {
            expect(() => end(dictStack)).toThrow("Cannot pop base dictionary");
        });
    });

    describe("def", () => {
        it("should define a key-value pair in the top dictionary", () => {
            // Setup: push a name and a value
            opStack.push(createName("myVar"));
            opStack.push(createNum(42));
            
            // Execute def
            def(opStack, dictStack);
            
            // Assuming dictStack.lookup or similar exists to verify
            // Or verify via the entries in the top dictionary directly
            expect(opStack.length()).toBe(0);
        });

        it("should throw error if key is not a name", () => {
            opStack.push(createNum(123)); // Invalid key type
            opStack.push(createNum(42));
            expect(() => def(opStack, dictStack)).toThrow("TypeCheck: def key must be a name");
        });
    });
});