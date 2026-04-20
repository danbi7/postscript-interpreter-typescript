import { OperandStack } from "../src/core/OperandStack";
import { PsObject } from "../src/types/PsObject";
import { ifOp, ifelseOp, forOp, repeat } from "../src/operators/flowOps";

describe("flowOps.ts Tests", () => {
    let opStack: OperandStack;
    let mockInterpreter: { execute: jest.Mock };

    beforeEach(() => {
        opStack = new OperandStack();
        mockInterpreter = {
            execute: jest.fn()
        };
    });

    const createBool = (val: boolean): PsObject => ({ type: 'boolean', value: val } as PsObject);
    const createNum = (val: number): PsObject => ({ type: 'number', value: val } as PsObject);
    const createProc = (ops: PsObject[] = []): PsObject => ({ type: 'procedure', value: ops } as PsObject);

    describe("ifOp", () => {
        it("should execute procedure if condition is true", () => {
            const proc = createProc([createNum(1)]);
            opStack.push(createBool(true));
            opStack.push(proc);
            
            ifOp(opStack, mockInterpreter);
            
            expect(mockInterpreter.execute).toHaveBeenCalledWith(proc.value);
        });

        it("should NOT execute procedure if condition is false", () => {
            opStack.push(createBool(false));
            opStack.push(createProc());
            
            ifOp(opStack, mockInterpreter);
            
            expect(mockInterpreter.execute).not.toHaveBeenCalled();
        });
    });

    describe("ifelseOp", () => {
        it("should execute first proc if true, second if false", () => {
            const procTrue = createProc([{ type: 'name', value: 'truePath' } as PsObject]);
            const procFalse = createProc([{ type: 'name', value: 'falsePath' } as PsObject]);

            // Test True
            opStack.push(createBool(true));
            opStack.push(procTrue);
            opStack.push(procFalse);
            ifelseOp(opStack, mockInterpreter);
            expect(mockInterpreter.execute).toHaveBeenCalledWith(procTrue.value);

            // Test False
            mockInterpreter.execute.mockClear();
            opStack.push(createBool(false));
            opStack.push(procTrue);
            opStack.push(procFalse);
            ifelseOp(opStack, mockInterpreter);
            expect(mockInterpreter.execute).toHaveBeenCalledWith(procFalse.value);
        });
    });

    describe("forOp", () => {
        it("should loop from init to limit and push index", () => {
            const proc = createProc();
            opStack.push(createNum(1));  // init
            opStack.push(createNum(1));  // step
            opStack.push(createNum(3));  // limit
            opStack.push(proc);

            forOp(opStack, mockInterpreter);

            expect(mockInterpreter.execute).toHaveBeenCalledTimes(3);
            // Verify loop variables were pushed: 1, 2, 3
            expect(opStack.pop().value).toBe(3);
            expect(opStack.pop().value).toBe(2);
            expect(opStack.pop().value).toBe(1);
        });

        it("should handle negative steps", () => {
            opStack.push(createNum(3));  // init
            opStack.push(createNum(-1)); // step
            opStack.push(createNum(1));  // limit
            opStack.push(createProc());

            forOp(opStack, mockInterpreter);

            expect(mockInterpreter.execute).toHaveBeenCalledTimes(3);
        });

        it("should throw error if step is zero", () => {
            opStack.push(createNum(1));
            opStack.push(createNum(0));
            opStack.push(createNum(5));
            opStack.push(createProc());

            expect(() => forOp(opStack, mockInterpreter)).toThrow("RangeCheck: step cannot be zero");
        });
    });

    describe("repeat", () => {
        it("should execute procedure N times", () => {
            const proc = createProc();
            opStack.push(createNum(5));
            opStack.push(proc);

            repeat(opStack, mockInterpreter);

            expect(mockInterpreter.execute).toHaveBeenCalledTimes(5);
        });

        it("should throw error for negative count", () => {
            opStack.push(createNum(-1));
            opStack.push(createProc());

            expect(() => repeat(opStack, mockInterpreter)).toThrow("RangeCheck: repeat count must be non-negative");
        });
    });
});