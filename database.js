const { execFile } = require('node:child_process');

function query(sql, values = []) {
  const args = ['-X', '-qAt', '--set=ON_ERROR_STOP=1'];
  values.forEach((value, index) => args.push(`--set=param${index}=${value}`));
  const bindings = values.map((_, index) => `:param${index}`).join(' ');
  const input = values.length ? `${sql}\n\\bind ${bindings}\n\\g\n` : `${sql};\n`;

  return new Promise((resolve, reject) => {
    const child = execFile('psql', args, { timeout: 10000 }, (error, stdout) => {
      if (error) reject(error);
      else resolve(stdout.trim());
    });
    child.stdin.on('error', reject);
    child.stdin.end(input);
  });
}

module.exports = { query };
