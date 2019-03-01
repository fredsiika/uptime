const repl = require('repl');
//const chalk require('chalk');
const log = console.log;

const msg = "Welcome to Papito Frederico\'s NodeJS REPL Env.";
repl.start('=> ').context.m = msg;

// Easily define your own themes:
// const error = chalk.bold.red;
// const warning = chalk.keyword('orange');
// const success = chalk.white.bold.bgGreenBright;


//log(chalk.bgGreenBright('Entering repl....'));