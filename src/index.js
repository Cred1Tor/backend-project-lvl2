import program from 'commander';
import { version } from '../package.json';

program.version(version);
program.description('Compares two configuration files and shows a difference.');

export default () => program.parse(process.argv);
