"use strict"

const AWS = require('aws-sdk'),
      s3 = new AWS.S3()

// Get bucket from ARN (arn:aws:s3:::my_bucket)
const bucket = process.env.BUCKET_ID.replace(/^.*:/, '')

module.exports = function handler(message) {
  console.dir(message)

  switch (message.method) {
    case 'GET':
    case 'HEAD':
    case 'PUT':
    case 'DELETE':
      return redirect(message.method, message.pathname.slice(1))

    default:
      return {statusCode: 405, body: `Method ${message.method} not allowed`}
  }
}

function createSignedUrl(path, operation) {
  let params = {
        Bucket: bucket,
        Key: path,
        Expires: 5 * 60 // Link expires in 5 minutes
      }

  return s3.getSignedUrl(operation, params)
}

function redirect(method, path) {
  let operation

  switch (method) {
    case 'GET':
      operation = 'getObject'
      break

    case 'HEAD':
      operation = 'headObject'
      break

    case 'PUT':
      operation = 'putObject'
      break

    case 'DELETE':
      operation = 'deleteObject'
      break

    default:
      throw new Error(`Invalid method operation ${method}`)
  }

  let url = createSignedUrl(path, operation)

  return {
    statusCode: 307,
    headers: {
      Location: url
    }
  }
}
