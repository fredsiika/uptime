import test from 'ava';
import chalk from 'chalk';
import execa from 'execa';

process.env.FORCE_COLOR = true;
chalk.enabled = true;

const macro = async (t, {args, opts}, expected) => {
	const stdout = await execa.stdout('./cli.js', args, opts);
	t.is(stdout, expected);
};

const templateMacro = (t, input, expected) => {
	return macro(t, {args: ['--template', input, '--no-stdin']}, expected);
};

test('main', macro, {args: ['red', 'bold', 'unicorn', '--no-stdin']},
	chalk.red.bold('unicorn'));
test('stdin', macro, {args: ['red', 'bold'], opts: {input: 'unicorn'}},
	chalk.red.bold('unicorn'));
test('number', macro, {args: ['red', 'bold', '123', '--no-stdin']},
	chalk.red.bold('123'));

test('template', templateMacro, '{red.bold unicorn}',
	chalk.red.bold('unicorn'));
test('template strikethrough', templateMacro, '{red.bold unicorns} are {blue.strikethrough FUN!!!}',
	chalk.red.bold('unicorns') + ' are ' + chalk.blue.strikethrough('FUN!!!'));
test('template underline', templateMacro, '{red.bold unicorn {blue.underline dancing}}',
	chalk.red.bold('unicorn ') + chalk.red.bold.blue.underline('dancing'));
test('template negation', templateMacro, '{red red {~red normal}}',
	chalk.red('red ') + 'normal');

test('template escaping #1', templateMacro, '{red hey\\} still red} not red',
	chalk.red('hey} still red') + ' not red');
test('template escaping #2', templateMacro, '{red hey\\\\} not red',
	chalk.red('hey\\') + ' not red');