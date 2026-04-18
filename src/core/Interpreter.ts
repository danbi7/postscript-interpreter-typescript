import { OperandStack } from "./OperandStack";
import { DictionaryStack } from "./DictionaryStack";
import { PsObject } from "../types/PsObject";

export class Interpreter {
    opStack: OperandStack;
    dictStack: DictionaryStack;
    isLexical: boolean = false; // Default scoping

    constructor() {
        this.opStack = new OperandStack();
        this.dictStack = new DictionaryStack();

        // Initial system dictionary
        this.dictStack.push({
            capacity: 100,
            entries: new Map<string, PsObject>()
        });
    }

    setScoping(lexical: boolean) {
        this.isLexical = lexical;
    }

    execute(tokens: PsObject[]): void {
        let i = 0;
        while (i < tokens.length) {
            const token = tokens[i];

            // CHECK TYPE FIRST: Is it the start of a procedure?
            if (token.type === 'open_proc') {
                const procTokens: PsObject[] = [];
                let depth = 1;
                i++;
                while (depth > 0 && i < tokens.length) {
                    if (tokens[i].type === 'open_proc') depth++;
                    if (tokens[i].type === 'close_proc') depth--;
                    if (depth > 0) procTokens.push(tokens[i]);
                    i++;
                }
                // Push the procedure block to the operand stack (Command #40, 41)
                this.opStack.push({ type: 'procedure', value: procTokens });
                continue; // Move to the next token after the closing '}'
            }

            // Handle normal execution
            if (token.type === 'executable_name') {
                const name = token.value as string;
                if (this.operators[name]) {
                    // FIX: Pass BOTH stacks to the operator functions
                    this.operators[name](this.opStack, this.dictStack, this);
                }
                else {
                    const found = this.dictStack.lookup(name);
                    if (found?.type === 'procedure') {
                        this.execute(found.value as PsObject[]);
                    } else if (found) {
                        this.opStack.push(found);
                    } else {
                        throw new Error(`Undefined: ${name}`);
                    }
                }
            }
            else if (token.type !== 'close_proc') {
                this.opStack.push(token);
            }
            i++;
        }
    }

    private operators: Record<string, Function> = {
        // Stack
        "exch": require("../operators/stackOps").exch,
        "pop": require("../operators/stackOps").pop,
        "copy": require("../operators/stackOps").copy,
        "dup": require("../operators/stackOps").dup,
        "clear": require("../operators/stackOps").clear,
        "count": require("../operators/stackOps").count,

        // Arithmetic
        "add": require("../operators/arithmeticOps").add,
        "sub": require("../operators/arithmeticOps").sub,
        "mul": require("../operators/arithmeticOps").mul,
        "div": require("../operators/arithmeticOps").div,
        "idiv": require("../operators/arithmeticOps").idiv,
        "mod": require("../operators/arithmeticOps").mod,
        "abs": require("../operators/arithmeticOps").abs,
        "neg": require("../operators/arithmeticOps").neg,
        "ceiling": require("../operators/arithmeticOps").ceiling,
        "floor": require("../operators/arithmeticOps").floor,
        "round": require("../operators/arithmeticOps").round,
        "sqrt": require("../operators/arithmeticOps").sqrt,

        // Dictionary
        "dict": require("../operators/dictionaryOps").dict,
        "length": require("../operators/dictionaryOps").lengthOp,
        "maxlength": require("../operators/dictionaryOps").maxlength,
        "begin": require("../operators/dictionaryOps").begin,
        "end": require("../operators/dictionaryOps").end,
        "def": require("../operators/dictionaryOps").def, // Ensure this function takes (opStack, dictStack)

        // Strings & Booleans
        "get": require("../operators/stringOps").get,
        "getinterval": require("../operators/stringOps").getinterval,
        "putinterval": require("../operators/stringOps").putinterval,
        "eq": require("../operators/booleanOps").eq,
        "ne": require("../operators/booleanOps").ne,
        "ge": require("../operators/booleanOps").ge,
        "gt": require("../operators/booleanOps").gt,
        "le": require("../operators/booleanOps").le,
        "lt": require("../operators/booleanOps").lt,

        // Flow & I/O
        "if": require("../operators/flowOps").ifOp,
        "ifelse": require("../operators/flowOps").ifelseOp,
        "for": require("../operators/flowOps").forOp,
        "repeat": require("../operators/flowOps").repeat,
        "quit": () => process.exit(0),
        "print": require("../operators/ioOps").print,
        "=": require("../operators/ioOps").popPrint,
        "==": require("../operators/ioOps").popPrintPs,
    };
}