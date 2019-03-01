#!/usr/bin/env node
'use strict';
// const repl = require('repl');
// const chalk = require('chalk');
// const log = console.log;

// // Easily define your own themes:
// const error = chalk.bold.red;
// const warning = chalk.keyword('orange');
// const success = chalk.white.bold.bgGreenBright;

// console.log(error('Error!'));
// console.log(warning('Warning!'));
// console.log(success('Success!'));

// // Combine styled and normal strings
// log(chalk.yellowBright('Hello ')+chalk.cyan('Fucking ')+chalk.greenBright.bold('World')+chalk.red('!'));

// // Compose multiple styles using the chainable API
// log(chalk.blueBright.bgYellow.bold('Hello World'));

// // Pass in multiple arguments
// log(chalk.blue('Hello', 'World!', 'Foo', 'bar', 'biz', 'baz'));

// // Nest styles
// log(chalk.red('Hello', chalk.underline.bgBlue.bold('world') + '!'));

// // Nest styles of the same type even (color, underline, background)
// log(chalk.green(
// 	'I am a green line ' +
// 	chalk.blue.underline.bold('with a blue substring') +
// 	' that becomes green again!'
// ));

// // ES2015 template literal
// log(`
// CPU: ${chalk.red('90%')}
// RAM: ${chalk.green('40%')}
// DISK: ${chalk.yellow('70%')}
// `);

// // ES2015 tagged template literal
// // log(chalk`
// // CPU: {red ${cpu.totalPercent}%}
// // RAM: {green ${ram.used / ram.total * 100}%}
// // DISK: {rgb(255,131,0) ${disk.used / disk.total * 100}%}
// // `);

// // Use RGB colors in terminal emulators that support it.
// log(chalk.keyword('orange')('Yay for orange colored text!'));
// log(chalk.rgb(123, 45, 67).underline('Underlined reddish color'));
// log(chalk.hex('#DEADED').bold('Bold gray!'));

// // Take advantage of console.log string substitution:
// const name = 'Papito Frederico';
// console.log('Hello '+chalk.green('%s'), name);

// console.time('100-elements');
// for (let i = 0; i < 100; i++) {}
// console.timeEnd('100-elements');



// const count = 5;
// console.log('count: %d', count);
// // Prints: count: 5, to stdout
// console.log('count:', count);
// // Prints: count: 5, to stdout


const ansiStyles = require('ansi-styles');
const chalk = require('chalk');
const dotProp = require('dot-prop');
const getStdin = require('get-stdin');
const meow = require('meow');

const printAllStyles = () => {
	const styles = [
		'bold',
		'dim',
		'italic',
		'underline',
		'inverse',
		'strikethrough',
		'black',
		'red',
		'green',
		'yellow',
		'blue',
		'magenta',
		'cyan',
		'white',
		'gray',
		'bgBlack',
		'bgRed',
		'bgGreen',
		'bgYellow',
		'bgBlue',
		'bgMagenta',
		'bgCyan',
		'bgWhite'
	];

	console.log(styles.map(style => chalk[style](style)).join(' '));
};

const cli = meow(`
	Usage
	  $ chalk <style> … <string>
	  $ echo <string> | chalk <style> …
	Options
	  --template, -t  Style template. The \`~\` character negates the style.
	  --demo          Demo of all Chalk styles.
	Examples
	  $ chalk red bold 'Unicorns & Rainbows'
	  $ chalk -t '{red.bold Unicorns & Rainbows}'
	  $ chalk -t '{red.bold Dungeons and Dragons {~bold.blue (with added fairies)}}'
`, {
	flags: {
		template: {
			type: 'string',
			alias: 't'
		},
		demo: {
			type: 'boolean'
		}
	}
});

const styles = cli.input;

function init(data) {
	for (const style of styles) {
		if (!Object.keys(ansiStyles).includes(style)) {
			console.error(`Invalid style: ${style}`);
			process.exit(1);
		}
	}

	const fn = dotProp.get(chalk, styles.join('.'));
	console.log(fn(data.replace(/\n$/, '')));
}

if (process.stdin.isTTY || cli.flags.stdin === false) {
	if (cli.flags.demo) {
		printAllStyles();
	} else if (cli.flags.template) {
		if (cli.input.length === 0) {
			try {
				const tagArray = [cli.flags.template];
				tagArray.raw = tagArray;
				console.log(chalk(tagArray));
			} catch (error) {
				console.error('Something went wrong! Maybe review your syntax?\n');
				console.error(error.stack);
				process.exit(1);
			}
		} else {
			console.error('The --template option only accepts 1 argument');
			process.exit(1);
		}
	} else {
		if (styles.length < 2) {
			console.error('Input required');
			process.exit(1);
		}

		init(styles.pop());
	}
} else {
	if (styles.length === 0) {
		console.error('Input required');
		process.exit(1);
	}

	getStdin().then(init);
}