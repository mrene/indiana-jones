#!/usr/local/bin/node --harmony
'use strict';

let walk = require('./fs_util');
let program = require('commander');
let path = require('path');
let package = require('./package.json');
let fs = require('fs-extra');

program.version(package.version);

  // .command('instr <inputPath>')
program
  .command('instrument <inputPath> [ignore...]')
  .alias('i')
  .description('Instrument a file or directory')
  .option('-o --out [outPath]', `By default instrument will clone it\'s targets file/folder name, but you can change that with this switch`)
  .action(instrumentPath);

program.parse(process.argv);


function instrumentPath(inputPath, ignore, options) {
  ignore = ignore.length ? ignore : [];
  inputPath = path.resolve(inputPath);

  let stat = fs.statSync(inputPath);

  if (stat.isDirectory()) {
    let out = options.out ?
      path.resolve(options.out) :
      path.join(`${path.dirname(inputPath)}`, `${path.basename(inputPath)}-instrumented`);

    fs.copy(inputPath, out);

    walk(out, ignore, function(err, res) {
      if (err) console.log(err);
      else {
        console.log(res);
        console.log('Count:', res.length);
        console.log('dumping to:', options.out);
      }
    });
  } else {
    let ext = path.extname(inputPath);
    let out = options.out ?
      path.resolve(options.out) :
      path.join(`${path.dirname(inputPath)}`, `${path.basename(inputPath, ext)}-instrumented${ext}`);

    fs.copy(inputPath, out);

    intrument(out, 'utf8', out);
  }

}