'use strict'

const request = require('request')

const sendSlackNotification = (options, errors) => {
  const slack = options.slack
  const name = options.name

  if (slack) {
    const endpoint = 'https://slack.com/api/chat.postMessage'
    const t = slack.token
    const c = slack.channel
    const u = name
    const i = 'https://avatars1.githubusercontent.com/u/6334870?v=3&s=70'
    const l = 'D00000'
    const m = errors.join("\n")

    const url = `${endpoint}?token=${t}&channel=${c}&text=&username=${u}&attachments=%5B%7B%22color%22%3A%20%22%23${l}%22%2C%20%22text%22%3A%20%22${m}%22%7D%5D&icon_url=${i}&pretty=1`
    request.get(url)
  }
}

const response = (res, options, errors) => {
  var status = 'ok'
  if (errors.length > 0) {
    status = 'error'
    sendSlackNotification(options, errors)
  }

  return res.status(200).json({
    name: options.name,
    version: options.version,
    status: status,
    errors: errors
  })
}

const validateSwaggerSchemaVersion = (apiOptions) => {
  return new Promise((resolve, reject) => {
    const name = apiOptions.name
    const localSchema = apiOptions.localSchema
    const uri = apiOptions.uri

    const clientGlobalName = apiOptions.globalName
    if (!global[clientGlobalName]) {
      return resolve(`${name}: Swagger schema is unreachable`)
    }

    request
      .get(uri, (error, res, body) => {
        if (error) {
          return resolve(error)
        }

        const remoteSchema = JSON.parse(body)
        const localVersion = localSchema.info.version
        const remoteVersion = remoteSchema.info.version
        if (localVersion != remoteVersion) {
          return resolve(`${name}: Swagger version mismatch, expected: v${localVersion}, returned: v${remoteVersion}`)
        }

        resolve()
      })
  })
}

const checkHealth = (options) => {
  return (req, res, next) => {
    var errors = []
    var counter = 0

    if (options.apis.length == 0) {
      return response(res, options, errors)
    }

    options.apis.forEach((value) => {
      validateSwaggerSchemaVersion(value).then((validationError) => {
        counter += 1

        if (validationError)
          errors.push(validationError)

        if (options.apis.length == counter)
          response(res, options, errors)
      })
    })
  }
}

module.exports = checkHealth
