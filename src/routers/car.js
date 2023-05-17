const express = require('express')
const router = new express.Router()

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const email = require('../utils/email')
const { Op } = require('sequelize');
const cAuth = require('../middlewares/customerAuth')

const Customer = require('../models/customer')
const Location = require('../models/location')
const Rental = require('../models/rental')
const User = require('../models/user')
const Car = require('../models/car')
const Brand = require('../models/brand')
const CarFeatures = require('../models/car_feature')
const Review = require('../models/review')
const Feature = require('../models/feature')

router.get('/', async(req,res) => {

    try{
        
        const locations = await Location.findAll()

        const cars = await Car.findAll({
            include: [
                {
                    model: Brand
                }
            ],
            limit:6
        })

        res.render('site/views/index', {locations, cars})

    } catch(e) {
        console.log(e)
    }

})

router.get('/cars', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Current page number
        const carsPerPage = 10; // Number of cars to display per page

        const totalCount = await Car.count();
        const totalPages = Math.ceil(totalCount / carsPerPage);

        const offset = (page - 1) * carsPerPage;
        const cars = await Car.findAll({
            include: [
                {
                    model: Brand
                }
            ],
            limit: carsPerPage,
            offset: offset
        });

        res.render('site/views/cars', { cars, page, totalPages });
    } catch (e) {
        console.log(e);
    }
});


router.get('/cars/:slug', async(req,res) => {

    try{
        
        const car = await Car.findOne({
            where: {
                slug: req.params.slug
            }, include: [
                {
                    model: Brand
                },
                {
                    model: CarFeatures
                },
                {
                    model: Review
                }
            ]
        })

        const relatedCars = await Car.findAll({
            where: {
              type: car.type,
              id: {
                [Op.ne]: car.id // exclude current car by ID
              }
            },
            include: [
                {
                    model: Brand
                }
            ],
            limit: 3
          });

          const features = await Feature.findAll()
          

        res.render('site/views/car-detail', {car, relatedCars, features})

    } catch(e) {
        console.log(e)
    }

})

router.get('/contact', (req,res) => {
    res.render('site/views/contact')
})

router.get('/about', (req,res) => {
    res.render('site/views/about')
})

router.get('/services', (req,res) => {
    res.render('site/views/services')
})

router.get('/pricing', async(req,res) => {

    try{

        const cars = await Car.findAll({
            include: [
                {
                    model: Brand
                },
                {
                    model: Review
                }
            ]
        })

        console.log(cars[0].reviews[0].rating)

        res.render('site/views/pricing', {cars})
    } catch(e) {
        console.log(e)
    }

    
})

router.get('/blogs', (req,res) => {
    res.render('site/views/blogs')
})

router.get('/login', (req,res) => {
    res.render('site/views/login')
})

router.get('/customer/register', (req,res) => {
    res.render('site/views/register')
})

router.get('/customer/login', (req,res) => {
    res.render('site/views/customer-login')
})


router.post('/login', async(req,res) => {

    try{
        
        const { email, password } = req.body

        const user = await User.findOne({
            where: {email}
        })

        if(!user) {
            return res.status(400).json({
                status: false,
                message: 'Invalid email or password!'
            })
        }

        const passwordMatch = await bcrypt.compare(password, user.password)

        if(!passwordMatch) {
            return res.status(400).json({
                status: false,
                message: 'Invalid email or password!'
            })
        }

        const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET, {expiresIn: '12h'})

        res.cookie('token', token, {httpOnly: true})

        res.status(200).json({
            status: true,
            message: 'Login successful!'
        })

    } catch(e) {
        console.log(e)
        res.status(400).send(e)
    }

})

router.post('/customer/login', async(req,res) => {

    try{
        
        const { email, password } = req.body

        const customer = await Customer.findOne({
            where: {email}
        })

        if(!customer) {
            return res.status(400).json({
                status: false,
                message: 'Invalid email or password!'
            })
        }

        const passwordMatch = await bcrypt.compare(password, customer.password)

        if(!passwordMatch) {
            return res.status(400).json({
                status: false,
                message: 'Invalid email or password!'
            })
        }

        const token = jwt.sign({customerId: customer.id}, process.env.JWT_SECRET, {expiresIn: '12h'})

        res.cookie('customerToken', token, {httpOnly: true})

        res.status(200).json({
            status: true,
            message: 'Login successful!'
        })

    } catch(e) {
        console.log(e)
        res.status(400).send(e)
    }

})

router.post('/customer/register', async(req,res) => {
  
    try{

        const { name, email, password, repassword } = req.body
        
        if(password != repassword) {
            return res.status(400).json({
                status: false,
                message: 'Password not match!'
            })
        }

        const emailExists = await Customer.findOne({
            where: {email}
        })

        if(emailExists) {
            return res.status(400).json({
                status: false,
                message: 'A user with this email already exists!'
            })
        }


        const customer = new Customer(req.body)
        customer.password = await bcrypt.hash(password, 10)

        await customer.save()

        res.status(201).json({
            status: false,
            message: 'Success!.'
        })

    } catch(e) {
        console.log(e)
        res.status(400).json({
            status: false,
            message: 'An error occured. Please try again later.'
        })
    }
    
})

router.get('/search', async(req,res) => {

    try{
    
        const date1 = new Date(req.query.pickup_date);
        const date2 = new Date(req.query.dropoff_date);

        const differenceMs = Math.abs(date2 - date1);
        const days = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));

        const location = await Location.findOne({
            where: {
                city: req.query.pickup
            }
        })

        const page = parseInt(req.query.page) || 1; // Current page number
        const carsPerPage = 10; // Number of cars to display per page

        const totalCount = await Car.count();
        const totalPages = Math.ceil(totalCount / carsPerPage);

        const offset = (page - 1) * carsPerPage;

        const cars = await Car.findAll({
            where: {
              locationId: location.id
            },
            include: [
              {
                model: Brand
              }
            ],
            limit: carsPerPage,
            offset: offset
          });
          

        res.render('site/views/search', {cars, totalPages, page, location, days})

    } catch(e) {
        console.log(e)
    }

})

router.post('/contact', async(req,res) => {

    const {name,email,subject,message} = req.body

    if(!name || !email || !subject || !message) {
        return res.status(400).json({
            status: false,
            message: 'Please fill up all fields...'
        })
    }

    const newMessage = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_TO,
        subject: 'A New Message From A Customer',
        text: req.body.message,
        html: `<p><b>From:</b> ${name}</p>
        <p><b>Email</b>: ${email}</p>
        <p><b>Subject</b>: ${subject}</p>
        <p><b>Message</b>: ${message}</p>`
      };

    try {
        await email.sendMail(newMessage)
        res.status(200).send()
    } catch(e) {
        console.log(e)
        res.status(400).send(e)
    }

})

// router.post('/user/save', async(req,res) => {

//     try{
        
//         const user = new User(req.body)
//         user.password = await bcrypt.hash(req.body.password, 10)

//         await user.save()

//         res.status(201).send()

//     } catch(e) {
//         console.log(e)
//         res.status(400).send(e)
//     }

// })

module.exports = router