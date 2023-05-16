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
        
        res.render('site/views/index')

    } catch(e) {
        console.log(e)
    }

})

router.get('/cars', async(req,res) => {

    try{
        
        const cars = await Car.findAll({
            include: [
                {
                    model: Brand
                }
            ]
        })

        res.render('site/views/cars', {cars})

    } catch(e) {
        console.log(e)
    }

})

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