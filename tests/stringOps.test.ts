import { OperandStack } from "../src/core/OperandStack";
import { PsObject } from "../src/types/PsObject";
import { length, get, getinterval, putinterval } from "../src/operators/stringOps";

describe("stringOps.ts Tests", () => {
    let opStack: OperandStack;

    beforeEach(() => {
        opStack = new OperandStack();
    });

    const createStr = (val: string): PsObject => ({ type: 'string', value: val } as PsObject);
    const createNum = (val: number): PsObject => ({ type: 'number', value: val } as PsObject);

    describe("length", () => {
        it("should return the correct length of a string", () => {
            opStack.push(createStr("PostScript"));
            length(opStack);
            expect(opStack.pop().value).toBe(10);
        });

        it("should throw error if operand is not a string", () => {
            opStack.push(createNum(123));
            expect(() => length(opStack)).toThrow("TypeCheck: length requires a string");
        });
    });

    describe("get", () => {
        it("should return the character code at the specified index", () => {
            opStack.push(createStr("ABC")); // A=65, B=66, C=67
            opStack.push(createNum(1));
            get(opStack);
            expect(opStack.pop().value).toBe(66);
        });

        it("should throw error if stack is underflowed", () => {
            opStack.push(createStr("A"));
            expect(() => get(opStack)).toThrow("StackUnderflow: get requires string and index");
        });
    });

    describe("getinterval", () => {
        it("should return a substring based on index and count", () => {
            opStack.push(createStr("Hello World"));
            opStack.push(createNum(6)); // index
            opStack.push(createNum(5)); // count
            getinterval(opStack);
            
            const result = opStack.pop();
            expect(result.type).toBe('string');
            expect(result.value).toBe("World");
        });
    });

    describe("putinterval", () => {
        it("should modify the original string object value", () => {
            const targetStr = createStr("Hello _____");
            opStack.push(targetStr);
            opStack.push(createNum(6)); // index
            opStack.push(createStr("World")); // replacement
            
            putinterval(opStack);
            
            // In your implementation, the original object's value is updated
            expect(targetStr.value).toBe("Hello World");
            expect(opStack.length()).toBe(0); // Operands should be popped
        });

        it("should overwrite specific segments of the string", () => {
            const targetStr = createStr("123456");
            opStack.push(targetStr);
            opStack.push(createNum(1));
            opStack.push(createStr("XX"));
            
            putinterval(opStack);
            
            expect(targetStr.value).toBe("1XX456");
        });
    });
});