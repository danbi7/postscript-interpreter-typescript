import { OperandStack } from "../core/OperandStack";

// Command #7: Adds top two numbers from the stack and pushes the result back onto the stack
export const add = (opStack: OperandStack): void => {
    if (opStack.length() < 2) {
        throw new Error("add operator requires two numbers.");
    }

    const b = opStack.pop();
    const a = opStack.pop();

    if (a.type !== 'number' || b.type !== 'number') {
        throw new Error("add operator requires two numbers.");
    }

    const result = (a.value as number) + (b.value as number);
    opStack.push({ type: 'number', value: result });
}

// Command #8: Subtracks top two numbers from the stack and pushes the result back onto the stack
export const sub = (opStack: OperandStack): void => {
    if (opStack.length() < 2) {
        throw new Error("sub operator requires two numbers.");
    }

    const b = opStack.pop();
    const a = opStack.pop();

    if (a.type !== 'number' || b.type !== 'number') {
        throw new Error("sub operator requires two numbers.");
    }

    const result = (a.value as number) - (b.value as number);
    opStack.push({ type: 'number', value: result });
}

// Command #9: Multiplies top two numbers from the stack and pushes the result back onto the stack
export const mul = (opStack: OperandStack): void => {
    if (opStack.length() < 2) {
        throw new Error("mul operator requires two numbers.");
    }

    const b = opStack.pop();
    const a = opStack.pop();

    if (a.type !== 'number' || b.type !== 'number') {
        throw new Error("mul operator requires two numbers.");
    }

    const result = (a.value as number) * (b.value as number);
    opStack.push({ type: 'number', value: result });
}

// Command #10: Pops two numbers and pushes (a / b)
export const div = (opStack: OperandStack): void => {
    if (opStack.length() < 2) {
        throw new Error("div operator requires two numbers.");
    }

    const b = opStack.pop();
    const a = opStack.pop();

    if (a.type !== 'number' || b.type !== 'number') {
        throw new Error("div operator requires two numbers.");
    }

    const result = (a.value as number) / (b.value as number);
    opStack.push({ type: 'number', value: result });
}

// Command #11: Pops two numbers and pushes (a % b)
export const mod = (opStack: OperandStack): void => {
    if (opStack.length() < 2) {
        throw new Error("mod operator requires two numbers.");
    }

    const b = opStack.pop();
    const a = opStack.pop();

    if (a.type !== 'number' || b.type !== 'number') {
        throw new Error("mod operator requires two numbers.");
    }

    const result = (a.value as number) % (b.value as number);
    opStack.push({ type: 'number', value: result });
}

// Command #12: Pops two numbers and pushes (a % b)
export const idiv = (opStack: OperandStack): void => {
    if (opStack.length() < 2) {
        throw new Error("idiv operator requires two numbers.");
    }

    const b = opStack.pop();
    const a = opStack.pop();

    if (a.type !== 'number' || b.type !== 'number') {
        throw new Error("idiv operator requires two numbers.");
    }

    const result = Math.trunc((a.value as number) / (b.value as number));
    opStack.push({ type: 'number', value: result });
}

// Command #13:  Pushes absolute value of top number
export const abs = (opStack: OperandStack): void => {
    if (opStack.length() < 1) {
        throw new Error("abs operator requires a number.");
    }

    const a = opStack.pop();

    if (a.type !== 'number') {
        throw new Error("abs operator requires a number.");
    }

    const result = Math.abs(a.value as number);
    opStack.push({ type: 'number', value: result });
}

// Command #14: Pushes negation of top number
export const neg = (opStack: OperandStack): void => {
    if (opStack.length() < 1) {
        throw new Error("neg operator requires a number.");
    }

    const a = opStack.pop();

    if (a.type !== 'number') {
        throw new Error("neg operator requires a number.");
    }

    const result = -(a.value as number);
    opStack.push({ type: 'number', value: result });
}

// Command #15: Pushes smallest integer >= x
export const ceiling = (opStack: OperandStack): void => {
    if (opStack.length() < 1) {
        throw new Error("ceiling operator requires a number.");
    }

    const a = opStack.pop();

    if (a.type !== 'number') {
        throw new Error("ceiling operator requires a number.");
    }

    const result = Math.ceil(a.value as number);
    opStack.push({ type: 'number', value: result });
}

// Command #16: Pushes largest integer <= x
export const floor = (opStack: OperandStack): void => {
    if (opStack.length() < 1) {
        throw new Error("floor operator requires a number.");
    }

    const a = opStack.pop();

    if (a.type !== 'number') {
        throw new Error("floor operator requires a number.");
    }

    const result = Math.floor(a.value as number);
    opStack.push({ type: 'number', value: result });
}

// Command #17: Rounds to nearest integer
export const round = (opStack: OperandStack): void => {
    if (opStack.length() < 1) {
        throw new Error("round operator requires a number.");
    }

    const a = opStack.pop();

    if (a.type !== 'number') {
        throw new Error("round operator requires a number.");
    }

    const result = Math.round(a.value as number);
    opStack.push({ type: 'number', value: result });
}

// Command #18: Pushes squre root of top number
export const sqrt = (opStack: OperandStack): void => {
    if (opStack.length() < 1) {
        throw new Error("sqrt operator requires a number.");
    }

    const a = opStack.pop();

    if (a.type !== 'number') {
        throw new Error("sqrt operator requires a number.");
    }

    const result = Math.sqrt(a.value as number);
    opStack.push({ type: 'number', value: result });
}