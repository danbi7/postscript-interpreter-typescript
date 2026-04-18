import { OperandStack } from "../core/OperandStack";

// Command #45: Writes characters of string to console. Does not pop if it's not a string
export const print = (opStack: OperandStack): void => {
    if (opStack.isEmpty()) {
        throw new Error("StackUnderflow: print requires one operand.");
    }
    
    // Peek first to check type, as PostScript print expects a string 
    const obj = opStack.peek();
    if (obj.type !== 'string') {
        throw new Error("TypeCheck: print requires a string.");
    }

    console.log(obj.value as string);
};

// Command #46: Writes text representation of any to stdout and pops it
export const popPrint = (opStack: OperandStack): void => {
    if (opStack.isEmpty()) {
        throw new Error("StackUnderflow: = requires one operand.");
    }

    const obj = opStack.pop();
    console.log(obj.value.toString());
};

// Command #47: Like = but prints PostScript representation (e.g. "hello" prints as (hello))
export const popPrintPs = (opStack: OperandStack): void => {
    if (opStack.isEmpty()) {
        throw new Error("StackUnderflow: == requires one operand.");
    }
    
    const obj = opStack.pop();

    if (obj.type === 'string') {
        console.log(`(${obj.value})`);
    } else if (obj.type === 'procedure') {
        console.log(`{ ...procedure... }`);
    } else if (obj.type === 'name') {
        console.log(`/${obj.value}`);
    } else {
        console.log(obj.value.toString());
    }
};