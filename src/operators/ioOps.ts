import { OperandStack } from "../core/OperandStack";

// Command #45: Writes characters of string to console. Does not pop if it's not a string
export const print = (opStack: OperandStack): void => {
    if (opStack.isEmpty()) {
        throw new Error("StackUnderflow: print requires one operand.");
    }

    const obj = opStack.pop();

    if (obj.type !== 'string') {
        throw new Error("TypeCheck: print requires a string.");
    }

    process.stdout.write(obj.value as string);
};

// Command #46: Writes text representation of any to stdout and pops it
export const popPrint = (opStack: OperandStack): void => {
    if (opStack.isEmpty()) {
        throw new Error("StackUnderflow: = requires one operand.");
    }

    const obj = opStack.pop();
    console.log(String(obj.value));
};

// Command #47: Like = but prints PostScript representation (e.g. "hello" prints as (hello))
export const popPrintPs = (opStack: OperandStack): void => {
    if (opStack.isEmpty()) {
        throw new Error("StackUnderflow: == requires one operand.");
    }

    const obj = opStack.pop();

    switch (obj.type) {
        case 'string':
            console.log(`(${obj.value})`);
            break;

        case 'name':
            console.log(`/${obj.value}`);
            break;

        case 'procedure':
            console.log('{ ... }');
            break;

        case 'dict':
            console.log('<<dict>>');
            break;

        default:
            console.log(String(obj.value));
    }
};