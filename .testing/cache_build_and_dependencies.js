#!/usr/bin/env node

const path = require('path');
const spawn = require('child_process').spawn;
const baseDir = path.resolve(__dirname, '../');
const srcDir = baseDir;

const cacheMeteor = function() {
  const childProcess = spawn('meteor', ['--raw-logs'], {
    cwd: srcDir,
    env: process.env
  });
  childProcess.stdout.setEncoding('utf8');
  childProcess.stderr.setEncoding('utf8');
  childProcess.stdout.on('data', function(line) {
    process.stdout.write(line);
  });
  childProcess.stderr.on('data', function(line) {
    process.stderr.write(line);
  });
  const exitAfterBuild = function exitAfterBuild(line) {
    if (line.indexOf('App running at') !== -1) {
      childProcess.kill();
    } else if (
      line.indexOf('Your application is crashing') !== -1 ||
      line.indexOf('Errors prevented startup') !== -1) {
      childProcess.kill();
      throw new Error(line);
    }
  };
  childProcess.stdout.on('data', exitAfterBuild);
  childProcess.stderr.on('data', exitAfterBuild);
};

cacheMeteor();