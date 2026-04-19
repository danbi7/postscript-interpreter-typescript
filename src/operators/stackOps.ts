import { OperandStack } from "../core/OperandStack";
import { PsObject } from "../types/PsObject";

// Command #1: Exchanges the top two postions on the stack
export const exch = (opStack: OperandStack): void => {
    if (opStack.length() < 2) {
        throw new Error("exch operator requires two operands.");
    }

    const a = opStack.pop();
    const b = opStack.pop();

    opStack.push(a);
    opStack.push(b);
}

//  Command #2: Pop the top of the stack
export const pop = (opStack: OperandStack): void => {
    if (opStack.length() < 1) {
        throw new Error("pop operator requires one operand.");
    }
    opStack.pop();
}

// Command #3: Duplicates top n elements
export const copy = (opStack: OperandStack): void => {
    if (opStack.length() < 1) {
        throw new Error("copy operator requires one operand.");
    }
    const n = opStack.pop();
    if (n.type !== 'number' || n.value as number < 0) {
        throw new Error("copy requires a non-negative integer");
    }

    // Verify there are at least n additional elements to copy
    if (opStack.length() < (n.value as number)) {
        throw new Error("copy: not enough elements on stack");
    }

    // Extract the top n elements without removing them permanently
    // peek the elements from n-1 down to 0 to maintain original order
    const elementsToCopy: PsObject[] = [];
    for (let i = n.value as number - 1; i >= 0; i--) {
        // Use a peek method that accesses depth i from the top
        elementsToCopy.push(opStack.peek(i));
    }

    // Push the duplicates back onto the stack in order
    elementsToCopy.forEach((item) => {
        opStack.push(item);
    });
}

// Command #4: Duplicates the top element
export const dup = (opStack: OperandStack): void => {
    if (opStack.length() < 1) {
        throw new Error("dup operator requires one operand.");
    }

    const topElement = opStack.peek(0);
    opStack.push(topElement);
}

// Command #5: Clears the stack
export const clear = (opStack: OperandStack): void => {
    while (opStack.length() > 0) {
        opStack.pop();
    }
}

// Command #6: Counts the number of elements and pushes that number onto the stack
export const count = (opStack: OperandStack): void => {
    opStack.push({ type: 'number', value: opStack.length() })
}