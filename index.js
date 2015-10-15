'use strict'

var child = require('child_process')
var assign = require('lodash.assign')
var template = require('lodash.template')
var moment = require('moment')

var DEFAULT_OPTIONS = {
  timesheetFileName: 'timesheet.md',
  commitTemplate: '[${SHORT_NOW_DATE}] Record ${SHORT_COMMIT_DATE}',
  simulating: false,
  verbose: false
}

module.exports = dailyClockIn

//

function dailyClockIn (options) {
  options = assign({}, DEFAULT_OPTIONS, options)
  options._commitTemplate = template(options.commitTemplate)
  var log = _logger(options.verbose)
  var now = moment(new Date())

  return clockIn

  function clockIn () {
    return Promise.resolve()
    //
    .then(getLastCommitDate)
    .then(calculateDateDeltaWithNow)
    .then(commitAndLogAllDays)
    //
    .then(logGoodEnding)
    .catch(logBadEnding)
  }

  //

  function getLastCommitDate () {
    return _execAsync('git log -1 --format=%cd')
  }

  function calculateDateDeltaWithNow (date) {
    var prev = moment(new Date(date))

    if (!prev.isValid()) {
      throw new Error('The git commit date format is not supported : ' + date)
    }

    var daysDiff = now.diff(prev, 'days')

    return Array
      // range 0 -> daysDiff
      .apply(null, Array(daysDiff))
      .map(function dayToCommit (undef, delta) {
        return moment(prev).add(delta + 1, 'days')
      })
  }

  function commitAndLogAllDays (dates) {
    if (options.simulating) {
      console.log('The following dates are going to be recorded in the timesheet : ')
      console.dir(dates.map(String), {colors: true})
      return Promise.resolve()
    }
    return dates.reduce(function chainPromises (prev, date) {
      return prev.then(_recordWorkingDay.bind(null, date))
    }, Promise.resolve())
  }

  function logBadEnding (err) {
    console.error(err)
    console.log('Incomplet hack :(')
  }

  function logGoodEnding () {
    console.log('All done :)' + (options.simulating ? ' (simulating)' : ''))
  }

  //

  function _recordWorkingDay (day) {
    var antiDate = day.toString()

    process.env.GIT_AUTHOR_DATE =
    process.env.GIT_COMMITTER_DATE = antiDate

    var commitMessage = options._commitTemplate({
      FILE: options.timesheetFileName,
      SHORT_COMMIT_DATE: day.format('DD/MM/YYYY'),
      SHORT_NOW_DATE: now.format('DD/MM/YYYY')
    })
    var appendToTimesheetFile = _execAsync.bind(null, 'echo ' + antiDate + ' >> ' + options.timesheetFileName)
    var addUpdate = _execAsync.bind(null, 'git add ' + options.timesheetFileName)
    var commitUpdate = _execAsync.bind(null, 'git commit -m "' + commitMessage + '"')
    return Promise.resolve()
      .then(appendToTimesheetFile)
      .then(addUpdate)
      .then(commitUpdate)
  }

  function _execAsync (cmd) {
    log('$ ' + cmd)
    var output = ''
    function appendToOuput (data) {
      output += data
    }
    return new Promise(function (resolve, reject) {
      var stream = child.exec(cmd, {
        env: process.env,
        stdio: options.verbose ? 'inherit' : 'silent'
      }, function finish (err) {
        (err ? err.code : 0) === 0
        ? resolve(output)
        : reject(output)
      })
      stream.stdout.on('data', appendToOuput)
      stream.stderr.on('data', appendToOuput)
    })
  }
}

function _logger (isLogging) {
  return isLogging
   ? console.log.bind(console)
   : function noop () {}
}
