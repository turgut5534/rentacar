const jwt = require('jsonwebtoken')
const Customer = require('../models/customer')

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.customerToken

    if (!token) {
      throw new Error('No token found')
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET)
    const customerId = decoded.customerId

    const customer = await User.findByPk(customerId)
    req.customer = customer

    res.locals.customer = customer
    // res.locals.lastUrl = req.originalUrl.split('/')[2]

    next()
  } catch (err) {
 
    console.log(err)
    res.redirect('/customer/login')
  }
}

module.exports = authMiddleware