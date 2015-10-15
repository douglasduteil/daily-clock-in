#!/usr/bin/env node

'use strict'

var meow = require('meow')
var dailyClockIn = require('./')

var cli = meow({
  help: [
    'Usage',
    '  dailyClockIn [--verbose] [--file]',
    '',
    'Examples ',
    '  $ dailyClockIn',
    '  => Commit and push all every days between last commit and now',
    '',
    'Options',
    '  --verbose      Detailed summary.'
  ]
}, {
  string: ['_']
})

Promise.resolve(cli.input)
  .then(dailyClockIn({
    simulating: cli.flags.simulating,
    verbose: cli.flags.v || cli.flags.verbose
  }))

