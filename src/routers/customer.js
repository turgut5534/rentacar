const express = require('express')
const router = new express.Router()
const auth = require('../middlewares/customerAuth')
const Customer = require('../models/customer')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')
const compressImage = require('../middlewares/compressImage')
const carStatus = require('../utils/carStatus')

const Car = require('../models/car')
const Rental = require('../models/rental')
const Brand = require('../models/brand')

router.use(auth)

const uploadDirectory = path.join(__dirname, '../../uploads')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/customers/')
    },
    filename: function (req, file, cb) {
      const uniqueId = uuidv4();
      const ext = path.extname(file.originalname);
      cb(null, uniqueId + ext);
    }
});

const upload = multer({ storage: storage });

router.get('/profile', async(req,res) => {

    try{

        res.render('site/views/profile')

    } catch(e) {
        console.log(e)
    }

})

router.get('/reservations', async(req,res) => {

    try{

        const reservations = await Rental.findAll({
            where: {
                customerId: req.customer.id
            },
            include: [
                {
                    model: Car,
                    include: {
                        model: Brand
                    }
                }
            ]
        })

        res.render('site/views/reservations', {reservations, carStatus})

    } catch(e) {
        console.log(e)
    }

})

router.post('/profile/save', async(req,res) => {

    try{

        const customer = await Customer.findByPk(req.customer.id)

        await customer.update(req.body)

        res.redirect('/customer/profile')

    } catch(e) {
        console.log(e)
    }

})

router.post('/profile/image/update', upload.single('image') , compressImage , async(req,res) => {

    try{

        const customer = await Customer.findByPk(req.customer.id)

        if(req.file) {

            try {
                const path = uploadDirectory + '/customers/' + customer.image
                await fs.promises.unlink(path)
            }catch(e) {
                console.log(e)
            }

            customer.image = req.file.filename

        }

        await customer.save()

        res.status(200).send()


    } catch(e) {
        console.log(e)
        res.status(400).send(e)
    }

})

module.exports = router