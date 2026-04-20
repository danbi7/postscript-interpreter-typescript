import { OperandStack } from "../src/core/OperandStack";
import { PsObject } from "../src/types/PsObject";
import { 
    add, sub, mul, div, mod, idiv, 
    abs, neg, ceiling, floor, round, sqrt 
} from "../src/operators/arithmeticOps";

describe("arithmeticOps.ts Tests", () => {
    let stack: OperandStack;

    beforeEach(() => {
        stack = new OperandStack();
    });

    // Helper with specific type casting to avoid TS2322
    const createNum = (val: number): PsObject => ({ 
        type: 'number', 
        value: val 
    } as PsObject);

    describe("Binary Operations (add, sub, mul, div, mod, idiv)", () => {
        it("should add two numbers (a + b)", () => {
            stack.push(createNum(10));
            stack.push(createNum(5));
            add(stack);
            expect(stack.pop().value).toBe(15);
        });

        it("should subtract two numbers (a - b)", () => {
            stack.push(createNum(10));
            stack.push(createNum(3));
            sub(stack);
            expect(stack.pop().value).toBe(7);
        });

        it("should multiply two numbers (a * b)", () => {
            stack.push(createNum(4));
            stack.push(createNum(2.5));
            mul(stack);
            expect(stack.pop().value).toBe(10);
        });

        it("should divide two numbers (a / b)", () => {
            stack.push(createNum(10));
            stack.push(createNum(4));
            div(stack);
            expect(stack.pop().value).toBe(2.5);
        });

        it("should perform modulo (a % b)", () => {
            stack.push(createNum(10));
            stack.push(createNum(3));
            mod(stack);
            expect(stack.pop().value).toBe(1);
        });

        it("should perform integer division (idiv)", () => {
            stack.push(createNum(7));
            stack.push(createNum(3));
            idiv(stack);
            expect(stack.pop().value).toBe(2); // 7 / 3 is 2.33, idiv truncates to 2
        });

        it("should throw error for binary ops if stack is too short", () => {
            stack.push(createNum(1));
            expect(() => add(stack)).toThrow("add operator requires two numbers.");
        });

        it("should throw error if operands are not numbers", () => {
            stack.push(createNum(1));
            stack.push({ type: 'boolean', value: true } as PsObject);
            expect(() => add(stack)).toThrow("add operator requires two numbers.");
        });
    });

    describe("Unary Operations (abs, neg, ceiling, floor, round, sqrt)", () => {
        it("should return absolute value", () => {
            stack.push(createNum(-5));
            abs(stack);
            expect(stack.pop().value).toBe(5);
        });

        it("should negate a number", () => {
            stack.push(createNum(10));
            neg(stack);
            expect(stack.pop().value).toBe(-10);
        });

        it("should calculate ceiling", () => {
            stack.push(createNum(2.1));
            ceiling(stack);
            expect(stack.pop().value).toBe(3);
        });

        it("should calculate floor", () => {
            stack.push(createNum(2.9));
            floor(stack);
            expect(stack.pop().value).toBe(2);
        });

        it("should round to nearest integer", () => {
            stack.push(createNum(2.5));
            round(stack);
            expect(stack.pop().value).toBe(3);
        });

        it("should calculate square root", () => {
            stack.push(createNum(16));
            sqrt(stack);
            expect(stack.pop().value).toBe(4);
        });

        it("should throw error for unary ops if stack is empty", () => {
            expect(() => abs(stack)).toThrow("abs operator requires a number.");
        });
    });
});