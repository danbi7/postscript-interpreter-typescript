import * as readline from 'readline';
import { Interpreter } from './core/Interpreter';
import { Lexer } from './lexer/Lexer';

/**
 * PostScript REPL
 *
 * Usage:
 *   npx ts-node src/repl.ts           # dynamic scoping (default)
 *   npx ts-node src/repl.ts --lexical # static/lexical scoping
 *
 * Multi-line input: the REPL keeps collecting lines until all
 * braces { } are balanced, then executes the complete expression.
 */
function startRepl(useLexical: boolean = false): void {
    const interpreter = new Interpreter();
    interpreter.setScoping(useLexical);

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: true,
    });

    console.log('PostScript Interpreter (TypeScript)');
    console.log(`Scoping mode: ${useLexical ? 'STATIC (lexical)' : 'DYNAMIC'}`);
    console.log("Type 'quit' to exit.\n");

    let buffer = '';
    let braceDepth = 0;
    let parenDepth = 0;

    const prompt = () => rl.question(buffer ? '  ... ' : 'REPL> ', handleLine);

    const handleLine = (line: string): void => {
        // Track brace and paren depth to support multi-line { } blocks
        for (const ch of line) {
            if (ch === '{') braceDepth++;
            else if (ch === '}') braceDepth--;
            else if (ch === '(') parenDepth++;
            else if (ch === ')') parenDepth--;
        }

        buffer = buffer ? buffer + ' ' + line : line;

        // Only evaluate when all delimiters are balanced
        if (braceDepth > 0 || parenDepth > 0) {
            prompt();
            return;
        }

        braceDepth = 0;
        parenDepth = 0;
        const input = buffer.trim();
        buffer = '';

        if (!input) {
            prompt();
            return;
        }

        if (input.toLowerCase() === 'quit') {
            console.log('Goodbye.');
            rl.close();
            return;
        }

        try {
            const tokens = Lexer.tokenize(input);
            interpreter.execute(tokens);
        } catch (err: any) {
            console.error(`Error: ${err.message}`);
        }

        prompt();
    };

    rl.on('close', () => process.exit(0));
    prompt();
}

// Parse CLI flags
const useLexical = process.argv.includes('--lexical');
startRepl(useLexical);