#!/usr/bin/env node

'use strict'

var meow = require('meow')
var dailyClockIn = require(require('path').join(__dirname, '..'))

var cli = meow({
  help: [
    'Usage',
    '  dailyClockIn [--verbose]',
    '',
    'Examples ',
    '  $ dailyClockIn',
    '  => Commit and push all every days between last commit and now'
  ]
}, {
  string: ['_']
})

Promise.resolve(cli.input)
  .then(dailyClockIn({
    verbose: cli.flags.v || cli.flags.verbose
  }))

