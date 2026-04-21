import { Interpreter } from './core/Interpreter';
import { Lexer } from './lexer/Lexer';

const run = (label: string, psCode: string, useLexical: boolean = false) => {
    const interpreter = new Interpreter();
    interpreter.setScoping(useLexical);
    console.log(`--- ${label} ---`);
    try {
        interpreter.execute(Lexer.tokenize(psCode));
    } catch (error: any) {
        console.error("Runtime Error:", error.message);
    }
    console.log();
};

// Proper scoping demo: getX is defined in outer scope where x=10,
// then a new inner scope (begin/end) shadows x with 99.
// Dynamic: getX sees runtime x=99. Lexical: getX sees definition-time x=10.
const scopeCode = "/x 10 def /getX { x = } def 5 dict begin /x 99 def getX end";

run("Dynamic Scoping  (expected: 99)", scopeCode, false);
run("Lexical Scoping  (expected: 10)", scopeCode, true);