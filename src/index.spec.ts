import { spawn } from 'child_process';
import { describe, expect, it } from 'vitest';
import { logger } from '.';

function determined(str: string) {
  return (
    str
      // remove colors
      .replace(/\u001b\[.*?m/gm, '')
      // remove file names
      .replace(/\/?[A-z][^ ]*\.ts:\d+:\d+/gm, 'file.ts')
      // remove timestamps
      .replace(/\d{2}:\d{2}:\d{2}:\d{3} \[/gm, '[')
      // standardize stack traces file names
      .replace(/at .+ \(.+\)/gm, 'at <file>')
  );
}

describe('index', () => {
  it('should do basic logging', async () => {
    const proc = spawn(`npx tsx src/tests.ts`, {
      shell: true,
      env: { ...process.env, NODE_ENV: 'production' },
    });
    let all = '';
    proc.stdout?.on('data', (data: Buffer) => {
      const str = data.toString();
      console.log(str);
      all += str;
    });
    proc.stderr?.on('data', (data) => {
      throw new Error(data.toString());
    });
    await new Promise((r) => proc.on('close', r));
    expect(determined(all)).matchSnapshot();
  });

  it('sould do pretty logging', async () => {
    const proc = spawn(`npx tsx src/tests.ts`, {
      shell: true,
      env: { ...process.env, NODE_ENV: 'production', LOG_FORMAT: 'pretty' },
    });
    let all = '';
    proc.stdout?.on('data', (data: Buffer) => {
      const str = data.toString();
      console.log(str);
      all += str;
    });
    proc.stderr?.on('data', (data) => {
      throw new Error(data.toString());
    });
    await new Promise((r) => proc.on('close', r));
    expect(determined(all)).matchSnapshot();
  });

  it('sould do dev logging', async () => {
    const proc = spawn(`npx tsx src/tests.ts`, {
      shell: true,
      env: { ...process.env, NODE_ENV: 'development' },
    });
    let all = '';
    proc.stdout?.on('data', (data: Buffer) => {
      const str = data.toString();
      console.log(str);
      all += str;
    });
    proc.stderr?.on('data', (data) => {
      throw new Error(data.toString());
    });
    await new Promise((r) => proc.on('close', r));
    expect(determined(all)).matchSnapshot();
  });

  it('should throw an error', () => {
    expect(() => {
      throw logger.throw('ding!');
    }).toThrowError('ding!');
    expect(() => {
      throw logger.throw({ err: new Error('dong!'), prop: 42 });
    }).toThrowError('dong!');
    expect(() => {
      throw logger.throw(new Error('ding!', { cause: new Error('dong!') }));
    }).toThrowError('ding!');
    expect(() => {
      throw logger.throw('ding!', { a: 12 });
    }).toThrowError('ding!');
  });
});
