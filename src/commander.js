import program from 'commander';
import genDiff from '.';
import { version } from '../package.json';

program.version(version)
  .description('Compares two configuration files and shows a difference.')
  .arguments('<firstConfig> <secondConfig>')
  .action((first, second) => console.log(genDiff(first, second)))
  .option('-f, --format [type]', 'output format');

export default () => program.parse(process.argv);
