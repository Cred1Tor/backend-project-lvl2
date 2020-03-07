import program from 'commander';
import genDiff from '.';
import { version } from '../package.json';

program.version(version)
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'output format', 'tree')
  .arguments('<firstConfig> <secondConfig>')
  .action((filepath1, filepath2) => {
    try {
      console.log(genDiff(filepath1, filepath2, program.format));
    } catch (e) {
      console.log(e.message);
      process.exitCode = 1;
    }
  });

export default () => program.parse(process.argv);
