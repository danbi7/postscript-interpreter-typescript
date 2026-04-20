import { OperandStack } from "../src/core/OperandStack";
import { PsObject } from "../src/types/PsObject";
import { 
    eq, ne, ge, gt, le, lt, 
    and, or, not, trueOp, falseOp 
} from "../src/operators/booleanOps";

describe("booleanOps.ts Tests", () => {
    let stack: OperandStack;

    beforeEach(() => {
        stack = new OperandStack();
    });

    const createObj = (val: any, type: PsObject['type']): PsObject => ({
        type,
        value: val
    } as PsObject);

    describe("Comparison Operators", () => {
        it("should test equality (eq)", () => {
            stack.push(createObj(10, 'number'));
            stack.push(createObj(10, 'number'));
            eq(stack);
            expect(stack.pop().value).toBe(true);
        });

        it("should test inequality (ne)", () => {
            stack.push(createObj(10, 'number'));
            stack.push(createObj(5, 'number'));
            ne(stack);
            expect(stack.pop().value).toBe(true);
        });

        it("should test greater than or equal (ge)", () => {
            stack.push(createObj(10, 'number'));
            stack.push(createObj(10, 'number'));
            ge(stack);
            expect(stack.pop().value).toBe(true);
        });

        it("should test greater than (gt)", () => {
            stack.push(createObj(10, 'number'));
            stack.push(createObj(5, 'number'));
            gt(stack);
            expect(stack.pop().value).toBe(true);
        });

        it("should test less than or equal (le)", () => {
            stack.push(createObj(5, 'number'));
            stack.push(createObj(5, 'number'));
            le(stack);
            expect(stack.pop().value).toBe(true);
        });

        it("should test less than (lt)", () => {
            stack.push(createObj(3, 'number'));
            stack.push(createObj(5, 'number'));
            lt(stack);
            expect(stack.pop().value).toBe(true);
        });
    });

    describe("Logical and Bitwise Operators", () => {
        it("should perform logical AND on booleans", () => {
            stack.push(createObj(true, 'boolean'));
            stack.push(createObj(false, 'boolean'));
            and(stack);
            expect(stack.pop().value).toBe(false);
        });

        it("should perform bitwise AND on numbers", () => {
            stack.push(createObj(6, 'number')); // 110
            stack.push(createObj(3, 'number')); // 011
            and(stack);
            expect(stack.pop().value).toBe(2);   // 010
        });

        it("should perform logical OR on booleans", () => {
            stack.push(createObj(true, 'boolean'));
            stack.push(createObj(false, 'boolean'));
            or(stack);
            expect(stack.pop().value).toBe(true);
        });

        it("should perform logical NOT", () => {
            stack.push(createObj(true, 'boolean'));
            not(stack);
            expect(stack.pop().value).toBe(false);
        });

        it("should perform bitwise NOT on numbers", () => {
            stack.push(createObj(0, 'number'));
            not(stack);
            expect(stack.pop().value).toBe(~0);
        });
    });

    describe("Boolean Constants", () => {
        it("should push true onto the stack", () => {
            trueOp(stack);
            const result = stack.pop();
            expect(result.type).toBe('boolean');
            expect(result.value).toBe(true);
        });

        it("should push false onto the stack", () => {
            falseOp(stack);
            const result = stack.pop();
            expect(result.type).toBe('boolean');
            expect(result.value).toBe(false);
        });
    });
});