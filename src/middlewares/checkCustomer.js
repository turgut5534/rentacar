const jwt = require('jsonwebtoken')
const Customer = require('../models/customer')

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.customerToken

    if (!token) {
      return next()
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET)
    const customerId = decoded.customerId

    const customer = await Customer.findByPk(customerId)
    req.customer = customer

    res.locals.customer = customer

    next()
  } catch (err) {
    console.log(err)
  }
}

module.exports = authMiddleware