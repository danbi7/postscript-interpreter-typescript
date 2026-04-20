import { OperandStack } from "../src/core/OperandStack";
import { exch, pop, copy, dup, clear, count } from "../src/operators/stackOps";
import { PsObject } from "../src/types/PsObject";

describe("stackOps.ts Tests", () => {
    let stack: OperandStack;

    beforeEach(() => {
        stack = new OperandStack();
    });

    const createObj = (val: any, type: PsObject['type'] = 'number'): PsObject => ({
        type,
        value: val
    } as PsObject);
    
    describe("exch", () => {
        it("should swap the top two elements", () => {
            stack.push(createObj(1));
            stack.push(createObj(2));
            exch(stack);
            expect(stack.pop().value).toBe(1);
            expect(stack.pop().value).toBe(2);
        });

        it("should throw error if stack length < 2", () => {
            stack.push(createObj(1));
            expect(() => exch(stack)).toThrow("exch operator requires two operands.");
        });
    });

    describe("pop", () => {
        it("should remove the top element", () => {
            stack.push(createObj(10));
            pop(stack);
            expect(stack.length()).toBe(0);
        });

        it("should throw error if stack is empty", () => {
            expect(() => pop(stack)).toThrow("pop operator requires one operand.");
        });
    });

    describe("copy", () => {
        it("should duplicate the top n elements", () => {
            stack.push(createObj(10)); // index 2
            stack.push(createObj(20)); // index 1
            stack.push(createObj(2));  // n = 2
            copy(stack);
            // Stack should be: [10, 20, 10, 20]
            expect(stack.length()).toBe(4);
            expect(stack.pop().value).toBe(20);
            expect(stack.pop().value).toBe(10);
        });

        it("should throw error if n is negative or not a number", () => {
            stack.push(createObj(-1));
            expect(() => copy(stack)).toThrow("copy requires a non-negative integer");
        });

        it("should throw error if stack lacks enough elements to copy", () => {
            stack.push(createObj(10));
            stack.push(createObj(5)); // n = 5, but only 1 element remains
            expect(() => copy(stack)).toThrow("copy: not enough elements on stack");
        });
    });

    describe("dup", () => {
        it("should duplicate the top element", () => {
            stack.push(createObj(50));
            dup(stack);
            expect(stack.length()).toBe(2);
            expect(stack.pop().value).toBe(50);
            expect(stack.pop().value).toBe(50);
        });

        it("should throw error if stack is empty", () => {
            expect(() => dup(stack)).toThrow("dup operator requires one operand.");
        });
    });

    describe("clear", () => {
        it("should remove all elements from the stack", () => {
            stack.push(createObj(1));
            stack.push(createObj(2));
            clear(stack);
            expect(stack.length()).toBe(0);
        });
    });

    describe("count", () => {
        it("should push the stack length onto the stack", () => {
            stack.push(createObj('a'));
            stack.push(createObj('b'));
            count(stack);
            const result = stack.pop();
            expect(result.type).toBe('number');
            expect(result.value).toBe(2);
        });
    });
});