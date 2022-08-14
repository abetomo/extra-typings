import { expectType, expectAssignable } from 'tsd';
import { Command, Argument, OptionValues } from '..';

// Reusing same program variable through tests for convenience.
const program = new Command();

// Non-empty array, but may dumb it down to string[] as minor benefits.
type VaridicStrings = [string, ...string[]];

/**
 * Check when no command-arguments.
 */

program
  .action((options) => {
    expectAssignable<OptionValues>(options);
  });

/**
 * Check command-arguments from .argument
 */

program
  .argument('<foo>')
  .action((foo, options) => {
    expectType<string>(foo);
    expectAssignable<OptionValues>(options);
  });

program
  .argument('[bar]')
  .action((bar, options) => {
    expectType<string | undefined>(bar);
    expectAssignable<OptionValues>(options);
  });

program
  .argument('<foo>')
  .argument('[bar]')
  .action((foo, bar, options) => {
    expectType<string>(foo);
    expectType<string | undefined>(bar);
    expectAssignable<OptionValues>(options);
  });

program
  .argument('[foo]', 'description', 'default')
  .action((foo, options, cmd) => {
    expectType<string>(foo);
    expectAssignable<OptionValues>(options);
  });

program
  .argument('<mult...>')
  .action((m, options) => {
    expectType<VaridicStrings>(m);
    expectAssignable<OptionValues>(options);
  });

program
  .argument('[mult...]')
  .action((m, options) => {
    expectType<VaridicStrings | undefined>(m);
    expectAssignable<OptionValues>(options);
  });

program
  .argument('[mult...]', 'description', ['a'])
  .action((m, options) => {
    expectType<VaridicStrings | string[]>(m);
    expectAssignable<OptionValues>(options);
  });

function myParseInt(arg: string, previous: number): number {
  return parseInt(arg);
}
function myParseInts(arg: string, previous: number[]): number[] {
  return previous.concat(parseInt(arg));
}

program
  .argument('<height>', 'description', myParseInt)
  .action((h, options) => {
    expectType<number>(h);
    expectAssignable<OptionValues>(options);
  });

program
  .argument('[height]', 'description', myParseInt)
  .action((h, options) => {
    expectType<number | undefined>(h);
    expectAssignable<OptionValues>(options);
  });

program
  .argument('[height...]', 'description', myParseInts, [])
  .action((h, options) => {
    expectType<number[]>(h);
    expectAssignable<OptionValues>(options);
  });

/**
 * Check command-arguments from .arguments()
 */

program
  .arguments('<foo>')
  .action((foo, options) => {
    expectType<string>(foo);
    expectAssignable<OptionValues>(options);
  });

program
  .arguments('[bar]')
  .action((bar, options) => {
    expectType<string | undefined>(bar);
    expectAssignable<OptionValues>(options);
  });

program
  .arguments('<foo> [bar]')
  .action((foo, bar, options) => {
    expectType<string>(foo);
    expectType<string | undefined>(bar);
    expectAssignable<OptionValues>(options);
  });


program
  .arguments('<file> <file> [files...]')
  .action((foo1, foo2, mult, options) => {
    expectType<string>(foo1);
    expectType<string>(foo2);
    expectType<VaridicStrings | undefined>(mult);
    expectAssignable<OptionValues>(options);
  });

/**
 * Check command-arguments from .addArgument()
 */

program
  .addArgument(new Argument('<foo>'))
  .action((foo, options) => {
    expectType<string>(foo);
    expectAssignable<OptionValues>(options);
  });

program
  .addArgument(new Argument('[bar]'))
  .action((bar, options, cmd) => {
    expectType<string | undefined>(bar);
    expectAssignable<OptionValues>(options);
  });

program
  .addArgument(new Argument('<foo>'))
  .addArgument(new Argument('[bar]'))
  .action((foo, bar, options) => {
    expectType<string>(foo);
    expectType<string | undefined>(bar);
    expectAssignable<OptionValues>(options);
  });

program
  .addArgument(new Argument('<foo...>'))
  .action((foo, options) => {
    expectType<VaridicStrings>(foo);
    expectAssignable<OptionValues>(options);
  });

  program
  .addArgument(new Argument('[foo]').default('x'))
  .action((foo, options) => {
    expectType<string>(foo);
    expectAssignable<OptionValues>(options);
  });

// historical behaviour, not core
program
  .addArgument(new Argument('<foo>').default(3))
  .action((foo, options) => {
    expectType<string | number>(foo);
    expectAssignable<OptionValues>(options);
  });

program
  .addArgument(new Argument('<foo>').argOptional())
  .action((foo, options) => {
    expectType<string | undefined>(foo);
    expectAssignable<OptionValues>(options);
  });

program
  .addArgument(new Argument('[foo]').argRequired())
  .action((foo, options) => {
    expectType<string>(foo);
    expectAssignable<OptionValues>(options);
  });

program
  .addArgument(new Argument('<foo>').argParser(myParseInt))
  .action((foo, options) => {
    expectType<number>(foo);
    expectAssignable<OptionValues>(options);
  });

program
  .addArgument(new Argument('[foo]').argParser(myParseInt))
  .action((foo, options) => {
    expectType<number | undefined>(foo);
    expectAssignable<OptionValues>(options);
  });

program
  .addArgument(new Argument('<foo...>').argParser(myParseInts))
  .action((foo, options) => {
    expectType<number[]>(foo);
    expectAssignable<OptionValues>(options);
  });


/** 
 * ToDo: command-arguments from .command('name <ARGS>')
 */
