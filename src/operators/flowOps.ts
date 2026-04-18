import { OperandStack } from "../core/OperandStack";
import { PsObject } from "../types/PsObject";

/**
 * Note: These functions require access to your main execution logic 
 * (referred to here as 'interpreter.execute') to process the procedures.
 */

// Command #40: if (bool proc if -)
export const ifOp = (opStack: OperandStack, interpreter: any): void => {
    const proc = opStack.pop();
    const condition = opStack.pop();

    if (condition.type !== 'boolean' || proc.type !== 'procedure') {
        throw new Error("TypeCheck: if requires [boolean] [procedure]");
    }

    if (condition.value === true) {
        // Execute each token inside the procedure
        (proc.value as PsObject[]).forEach(token => interpreter.execute(token));
    }
};

// Command #41: ifelse (bool proc1 proc2 ifelse -)
export const ifelseOp = (opStack: OperandStack, interpreter: any): void => {
    const proc2 = opStack.pop(); // false block 
    const proc1 = opStack.pop(); // true block 
    const condition = opStack.pop();

    if (condition.type !== 'boolean') throw new Error("TypeCheck: ifelse requires boolean");

    const procToExecute = condition.value === true ? proc1 : proc2;
    (procToExecute.value as PsObject[]).forEach(token => interpreter.execute(token));
};

// Command #42: for (init step limit proc for -)
export const forOp = (opStack: OperandStack, interpreter: any): void => {
    const proc = opStack.pop();
    const limit = opStack.pop();
    const step = opStack.pop();
    const init = opStack.pop();

    if (init.type !== 'number' || step.type !== 'number' ||
        limit.type !== 'number' || proc.type !== 'procedure') {
        throw new Error("TypeCheck: for requires [num] [num] [num] [procedure]");
    }

    const s = step.value as number;
    const l = limit.value as number;

    for (let i = init.value as number; (s > 0 ? i <= l : i >= l); i += s) {
        // PostScript 'for' pushes the current index to the stack before each iteration
        opStack.push({ type: 'number', value: i });
        (proc.value as PsObject[]).forEach(token => interpreter.execute(token));
    }
};

// Command #43: repeat (n proc repeat -)
export const repeat = (opStack: OperandStack, interpreter: any): void => {
    const proc = opStack.pop();
    const n = opStack.pop();

    if (n.type !== 'number' || proc.type !== 'procedure') {
        throw new Error("TypeCheck: repeat requires [number] [procedure]");
    }

    const count = n.value as number;
    for (let i = 0; i < count; i++) {
        (proc.value as PsObject[]).forEach(token => interpreter.execute(token));
    }
};

// Command #44: Terminate interpreter
export const quit = (opStack: OperandStack): void => {

};