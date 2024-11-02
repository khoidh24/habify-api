import JWT from 'jsonwebtoken'
import createError from 'http-errors'
import client from './redis_connect.js'
import dotenv from 'dotenv'
dotenv.config()

// Create a new Access Token
const signAccessToken = async (userId) => {
  return new Promise((resolve, reject) => {
    // get the userId and create a payload
    const payload = { userId }
    // get secret key
    const secretKey = process.env.ACCESS_TOKEN
    // JWT options
    const opts = {
      expiresIn: '1h'
    }
    // Sign the token using the payload and secret key, and options
    JWT.sign(payload, secretKey, opts, (err, token) => {
      if (err) return reject(err)
      resolve(token)
    })
  })
}

// Verify the Access Token
const verifyAccessToken = (req, res, next) => {
  // Check if the authorization header is not present
  if (!req.headers['authorization']) {
    return next(createError.Unauthorized())
  }
  // Get the token from the header
  const authorizeHeader = req.headers['authorization']
  // Split the token. Example: Bearer 15347341364 and we split it to ['Bearer', '15347341364']
  const splitBearerToken = authorizeHeader.split(' ')
  // Get the token
  const token = splitBearerToken[1]
  // Verify the token
  JWT.verify(token, process.env.ACCESS_TOKEN, (err, payload) => {
    if (err) {
      // Check if the token is expired
      if (err.name === 'JsonWebTokenError') {
        return next(createError.Unauthorized())
      }
      return next(createError.Unauthorized(err.message))
    }
    // If the token is valid, add the payload to the request object
    req.payload = payload
    next()
  })
}

// Create a new Refresh Token
const signRefreshToken = async (userId) => {
  return new Promise((resolve, reject) => {
    // Get the userId and create a payload
    const payload = { userId }
    // Get the secret key
    const secretKey = process.env.REFRESH_TOKEN
    // JWT options
    const opts = {
      expiresIn: '1y'
    }
    // Sign the token using the payload and secret key, and options
    JWT.sign(payload, secretKey, opts, (err, token) => {
      if (err) return reject(err)
      // Add Refresh Token to Redis
      client.set(
        userId.toString(),
        token,
        'EX',
        365 * 24 * 60 * 60,
        (err, reply) => {
          if (err) {
            return reject(createError.InternalServerError())
          }
          resolve(token)
        }
      )
    })
  })
}

// Verify the Refresh token
const verifyRefreshToken = async (refreshToken) => {
  return new Promise((resolve, reject) => {
    // Verify the token using the refresh token
    JWT.verify(refreshToken, process.env.REFRESH_TOKEN, (err, payload) => {
      if (err) {
        return reject(err)
      }
      // Get the userId from the payload and check if it exists in Redis
      client.get(payload.userId, (err, reply) => {
        if (err) {
          return reject(createError.InternalServerError())
        }
        if (refreshToken === reply) {
          return resolve(payload)
        }
        return reject(createError.Unauthorized())
      })
    })
  })
}

export {
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  verifyRefreshToken
}
