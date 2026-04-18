import { Interpreter } from './core/Interpreter';
import { Lexer } from './lexer/Lexer';

const run = (psCode: string, useLexical: boolean = false) => {
    const interpreter = new Interpreter();
    
    // Toggle scoping as required by Section 2.2
    interpreter.setScoping(useLexical);

    try {
        const tokens = Lexer.tokenize(psCode);
        interpreter.execute(tokens);
    } catch (error) {
        console.error("Runtime Error:", error);
    }
};

// Example PostScript program from your requirements
const code = "/x 10 def /f { x = } def /x 20 def f";

console.log("--- Dynamic Scoping (Default) ---");
run(code, false); // Expected: 20

console.log("--- Lexical Scoping ---");
run(code, true);  // Expected: 10