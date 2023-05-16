const express = require('express')
const router = new express.Router()

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { Op } = require('sequelize');

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

        res.render('site/views/index', {locations})

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

router.get('/pricing', (req,res) => {
    res.render('site/views/pricing')
})

router.get('/blogs', (req,res) => {
    res.render('site/views/blogs')
})

router.get('/login', (req,res) => {
    res.render('site/views/login')
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