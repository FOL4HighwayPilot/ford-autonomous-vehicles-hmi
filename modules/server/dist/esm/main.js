var yargs = require('yargs');

import { serverArgs } from './cmds/server';
export function main() {
  var args = yargs.alias('h', 'help');
  args = serverArgs(args, {
    defaultCommand: true
  });
  args.parse();
}
//# sourceMappingURL=main.js.map