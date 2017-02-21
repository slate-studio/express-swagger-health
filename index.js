'use strict'

const request  = require('request')

const health = (options) => {

  const response = (res, appName, appVersion, status) => {
    res.setHeader('Content-Type', 'application/json')
    const data = {
      name:    appName,
      version: appVersion,
      status:  status
    }
    return res.status(200).json(data)
  }

  return function (req, res, next) {

    var status       = 'ok'
    const appName    = options.name
    const appVersion = options.version

    var sendSlacNotification = false
    options = options || {}

    if (options.hasOwnProperty('swaggerCheck')) {
      const swaggerCheck = options.swaggerCheck
      const swaggerSchemaUri = swaggerCheck.swaggerSchemaUri
      const swaggerMockSpec = swaggerCheck.swaggerMockSpec
      const mockedSwaggerVersion = swaggerMockSpec.info.version
      request
        .get(swaggerSchemaUri, function(error, swaggerRes, body) {
          const actualSwaggerVersion = JSON.parse(body).info.version
          if (mockedSwaggerVersion != actualSwaggerVersion ) {
            status = 'Swagger Versions Mistmatched'
            if (options.hasOwnProperty('slack')) {
              const slack    = options.slack
              const token    = slack.token
              const channel  = slack.channel
              const iconUrl  = slack.iconUrl
              const color    = 'D00000'
              const userName = 'Regression test'
              const errorMessage = `Swagger Versions Mismatched for ${appName}, tests run against swagger schema v.${mockedSwaggerVersion}, but actual api version of schema is: ${actualSwaggerVersion}`
              var slackUri = `https://slack.com/api/chat.postMessage?token=${token}&channel=${channel}&text=&username=${userName}&attachments=%5B%7B%22color%22%3A%20%22%23${color}%22%2C%20%22text%22%3A%20%22${errorMessage}%22%7D%5D&icon_url=${iconUrl}&pretty=1`
              request.get(slackUri)
              response(res, appName, appVersion, status)
            } else {
              response(res, appName, appVersion, status)
            }
          } else {
            response(res, appName, appVersion, status)
          }
        })
    } else {
      response(res, appName, appVersion, status)
    }
  }
}


module.exports = health
