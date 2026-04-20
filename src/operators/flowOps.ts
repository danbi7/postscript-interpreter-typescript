import { OperandStack } from "../core/OperandStack";
import { PsObject } from "../types/PsObject";

// Command #40: Stack: bool proc -> -
export const ifOp = (opStack: OperandStack, interpreter: any): void => {
    const proc = opStack.pop();
    const condition = opStack.pop();

    if (condition.type !== 'boolean' || proc.type !== 'procedure') {
        throw new Error("TypeCheck: if requires [boolean] [procedure]");
    }

    if (condition.value === true) {
        interpreter.execute(proc.value as PsObject[]);
    }
};

// Command #41: Stack: bool proc1 proc2 -> -
export const ifelseOp = (opStack: OperandStack, interpreter: any): void => {
    const proc2 = opStack.pop(); // false branch
    const proc1 = opStack.pop(); // true branch
    const condition = opStack.pop();

    if (
        condition.type !== 'boolean' ||
        proc1.type !== 'procedure' ||
        proc2.type !== 'procedure'
    ) {
        throw new Error("TypeCheck: ifelse requires [boolean] [procedure] [procedure]");
    }

    const selected = condition.value === true ? proc1 : proc2;
    interpreter.execute(selected.value as PsObject[]);
};

// Command #42 Stack: init step limit proc -> -
export const forOp = (opStack: OperandStack, interpreter: any): void => {
    const proc = opStack.pop();
    const limit = opStack.pop();
    const step = opStack.pop();
    const init = opStack.pop();

    if (
        init.type !== 'number' ||
        step.type !== 'number' ||
        limit.type !== 'number' ||
        proc.type !== 'procedure'
    ) {
        throw new Error("TypeCheck: for requires [num] [num] [num] [procedure]");
    }

    const start = init.value as number;
    const inc = step.value as number;
    const end = limit.value as number;

    if (inc === 0) {
        throw new Error("RangeCheck: step cannot be zero");
    }

    for (
        let i = start;
        inc > 0 ? i <= end : i >= end;
        i += inc
    ) {
        // push loop variable each iteration (PostScript behavior)
        opStack.push({ type: 'number', value: i });

        interpreter.execute(proc.value as PsObject[]);
    }
};

// Command #43: Stack: n proc -> -
export const repeat = (opStack: OperandStack, interpreter: any): void => {
    const proc = opStack.pop();
    const n = opStack.pop();

    if (n.type !== 'number' || proc.type !== 'procedure') {
        throw new Error("TypeCheck: repeat requires [number] [procedure]");
    }

    const count = n.value as number;

    if (count < 0) {
        throw new Error("RangeCheck: repeat count must be non-negative");
    }

    for (let i = 0; i < count; i++) {
        interpreter.execute(proc.value as PsObject[]);
    }
};

// Command #44:Terminates interpreter execution
export const quit = (): void => {
    process.exit(0);
};