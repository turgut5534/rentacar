const express = require('express')
const router = new express.Router()

const auth = require('../middlewares/auth')
const compressImage = require('../middlewares/compressImage')
const path = require('path')
const fs = require('fs')
const multer = require('multer')
const { v4: uuidv4 } = require('uuid')
const slugify = require('slugify')
const {Op} = require('sequelize')
const moment = require('moment')

router.use(auth)

const Car = require('../models/car')
const CarFeatures = require('../models/car_feature')
const Brand = require('../models/brand')
const Location = require('../models/location')
const Feature = require('../models/feature')
const Rental = require('../models/rental')
const Customer = require('../models/customer')

const uploadDirectory = path.join(__dirname, '../../uploads')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/cars/')
    },
    filename: function (req, file, cb) {
      const uniqueId = uuidv4();
      const ext = path.extname(file.originalname);
      cb(null, uniqueId + ext);
    }
});
  
const upload = multer({ storage: storage });

router.get('/dashboard', (req,res) => {

    res.render('admin/views/dashboard')

})

router.get('/locations', async(req,res) => {

    try{

        const locations = await Location.findAll()

        res.render('admin/views/locations/locations', {locations})

    } catch(e) {
        console.log(e)
    }

})

router.get('/cars', async(req,res) => {

    try{

        const cars = await Car.findAll({
            include : [
                {
                    model: CarFeatures
                },
                {
                    model: Brand
                },
                {
                    model: Rental
                }
            ]
        })

         res.render('admin/views/cars/cars', {cars})
    } catch(e) {
        console.log(e)
    }

})

router.get('/cars/status/:status', async(req,res) => {

    try{

        let cars; 

        if(req.params.status == 'rented') {
            cars = await Car.findAll({
                include: [
                    {
                        model: CarFeatures
                    },
                    {
                        model: Brand
                    },
                    {
                        model: Rental,
                        where: {
                            carId: {
                                [Op.ne]: null
                            }
                        },
                        include: [
                            {
                                model: Customer
                            }
                        ]
                    }
                ]
            });
        } else {
            cars = await Car.findAll({
                include: [
                    {
                        model: CarFeatures
                    },
                    {
                        model: Brand
                    },
                    {
                        model: Rental,
                        required: false // Include rentals if available, but don't require them
                    }
                ],
                where: {
                    '$Rentals.id$': null // Filter cars that don't have any rentals
                }
            });
        }

        

         res.render('admin/views/cars/car-status', {cars})
    } catch(e) {
        console.log(e)
    }

})

router.get('/cars/add', async(req,res) => {

    try{

        const brands = await Brand.findAll()

        const locations = await Location.findAll()

        const carfeatures = await Feature.findAll()

        res.render('admin/views/cars/add-car', {brands, locations, carfeatures})
    } catch(e) {
        console.log(e)
    }

})

router.post('/cars/book/save', async(req,res) => {

    try{


        const { id,start_date, end_date, time, customerId, pickup_location, dropoff_location } = req.body

        const date1 = moment.utc(start_date).toDate();
        const date2 = moment.utc(end_date).toDate();

        const differenceMs = Math.abs(date2 - date1);
        const days = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));

        const car = await Car.findByPk(id)

        const customer = await Customer.findByPk(customerId)

        const pickupLocation = await Location.findByPk(pickup_location)
        const dropoffLocation = await Location.findByPk(dropoff_location)

        await Rental.create({
            start_date: start_date,
            end_date: end_date,
            time: time,
            duration: days,
            cost: car.price * days,
            customerId: customer.id,
            carId: car.id,
            pickup_location: pickupLocation.id,
            dropoff_location: dropoffLocation.id
        })

        res.redirect('/admin/cars/status/rented')

    } catch(e) {
        console.log(e)
    }

})

router.get('/cars/book/:id', async(req,res) => {

    try{

        const car = await Car.findByPk(req.params.id, {
            include: [
                {
                    model: Brand
                },
                {
                    model: Location
                }
            ]
        })

        const customers = await Customer.findAll()

        const locations = await Location.findAll()

        res.render('admin/views/cars/book', {car, customers, locations})

    } catch(e) {
        console.log(e)
    }

})

router.get('/cars/edit/:id', async(req,res) => {

    try{

        const brands = await Brand.findAll()

        const locations = await Location.findAll()

        const car = await Car.findByPk(req.params.id, {
            include: [
                {
                    model: Brand
                },
                {
                    model: Location
                },
                {
                    model: CarFeatures
                }
            ]
        })

        const features = await Feature.findAll()

        res.render('admin/views/cars/edit-car', {brands, locations, car, features})
    } catch(e) {
        console.log(e)
    }

})


router.post('/cars/save', upload.single('image'), compressImage, async(req,res) => {

    try{

        const { brandId, locationId, model, year, color, features } = req.body

        const brand = await Brand.findByPk(brandId)

        const slug = `${brand.name}_${model}_${year}_${color}`

        const car = new Car(req.body)
        car.image = req.file.filename
        car.brandId = brandId,
        car.locationId = locationId
        car.slug = slugify( slug ,{
            lower: true
        })

        const newCar = await car.save()

        if(features) {
            for(const featureId of features) {
                
                const feature = await Feature.findByPk(featureId)

                await CarFeatures.create({
                    carId: newCar.id,
                    featureId: feature.id
                })
            }
        }

        res.redirect('/admin/cars')

    } catch(e) {
        console.log(e)
    }

})

router.post('/cars/takecar/:id', async(req,res) => {

    try{

        const reservation = await Rental.findByPk(req.params.id)

        reservation.is_delivered = true

        await reservation.save()

        res.status(200).send()

    } catch(e) {
        console.log(e)
    }

})

router.get('/cars/extend/:id', async(req,res) => {

    try{

        const reservation = await Rental.findByPk(req.params.id, {
            include: [
                {
                    model: Customer
                }
            ]
        })

        res.render('admin/views/cars/extend', {reservation})

    } catch(e) {
        console.log(e)
    }

})

router.post('/cars/extend/save', async(req,res) => {

    try{

        const reservation = await Rental.findByPk(req.body.id)
        
        const car = await Car.findByPk(reservation.carId)

        const allReservations = await Rental.findAll({
            where: {
                carId: car.id,
                id: { [Op.ne]: reservation.id }
            }
        })

        const isBusy = allReservations.some(existingReservation =>
            reservation.start_date >= existingReservation.start_date && reservation.start_date <= existingReservation.end_date ||
            reservation.end_date >= existingReservation.start_date && reservation.end_date <= existingReservation.end_date
        )

        console.log(isBusy)

        if(isBusy) {
            return res.send('Sorry! This date is not available')
        }

        await reservation.update(req.body)

        res.redirect('/admin/cars/status/rented')

    } catch(e) {
        console.log(e)
    }

})

router.post('/cars/update', upload.single('image'), compressImage, async(req,res) => {

    try{

        const {id, features } = req.body

        const car = await Car.findByPk(id)

        await car.update(req.body)

        if(req.file) {

            try{
                const path = uploadDirectory + '/cars/' + car.image
                await fs.promises.unlink(path)
            } catch(e) {
                console.log(e)
            }

            car.image = req.file.filename

            await car.save()
        }

        const carFeatures = await CarFeatures.findAll({
            where: { carId: car.id },
            include: [Feature]
        });
      
        const featureIDs = carFeatures.map(feature => feature.feature.id);

        const checkedFeatures = features 
        let checkedFeatureIds = [] 
    

        if(checkedFeatures != undefined && Array.isArray(checkedFeatures) ) {
            checkedFeatureIds.push(checkedFeatures.map(id => parseInt(id)));
        }
    

        for(i=0; i<featureIDs.length; i++) {
    
        if(!checkedFeatureIds.includes(featureIDs[i])) {
            await CarFeatures.destroy({ where: { carId: car.id, featureID: featureIDs[i] } })
        }
    
        }

    
        if(features) {
            for(const featureId of features) {
                
                const feature = await Feature.findByPk(featureId)

                await CarFeatures.create({
                    carId: car.id,
                    featureId: feature.id
                })
            }
        }
        res.redirect('/admin/cars')

    } catch(e) {
        console.log(e)
    }

})

router.delete('/cars/delete/:id', async(req,res) => {

    try{
         
        const car = await Car.findByPk(req.params.id)

        if(!car) {
            return res.status(400).json({
                status: false,
                message: 'The car not found!'
            })
        }

        if(car.image) {

            try{
                 const path = uploadDirectory + '/cars/' + car.image
                 await fs.promises.unlink(path)
            } catch(e) {
                console.log(e)
            }

        }

        await car.destroy()

        res.status(200).json({
            status: true,
            message: 'Deleted successfuly!'
        })

    } catch(e) {
        console.log(e)
    }

})

router.get('/cars/features', async(req,res) => {

    try{

        const features = await Feature.findAll()
        res.render('admin/views/carFeatures/carFeatures', {features})

    } catch(e) {
        console.log(e)
    }

})


router.post('/cars/features/save', async(req,res) => {

    try{

        const feature = new Feature(req.body)

        const newFeature = await feature.save()

        res.status(201).json({feature: newFeature})

    } catch(e) {
        console.log(e)
        res.status(400).send(e)
    }

})

router.post('/cars/features/update', async(req,res) => {

    try{

        const feature = await Feature.findByPk(req.body.id)

        await feature.update(req.body)

        res.status(201).json({feature: feature})

    } catch(e) {
        console.log(e)
        res.status(400).send(e)
    }

})

router.delete('/cars/features/delete/:id', async(req,res) => {

    try{

        const feature = await Feature.findByPk(req.params.id)

        if(!feature) {
            return res.status(400).send(e)
        }

        await feature.destroy()

        res.status(200).send()

    } catch(e) {
        console.log(e)
        res.status(400).send(e)
    }

})


router.get('/saveFeatures', async(req,res) => {
    try {
        await Feature.create({name: 'AirConditioning'});
        await Feature.create({name: 'ChildSeat'});
        await Feature.create({name: 'Gps'});
        await Feature.create({name: 'Luggage'});
        await Feature.create({name: 'Music'});
        await Feature.create({name: 'SeatBelt'});
        await Feature.create({name: 'SleepingBed'});
        await Feature.create({name: 'Water'});
        await Feature.create({name: 'Bluetooth'});
        await Feature.create({name: 'OnboardComputer'});
        await Feature.create({name: 'AudioInput'});
        await Feature.create({name: 'LongTermTrips'});
        await Feature.create({name: 'CarKit'});
        await Feature.create({name: 'RemoteCentralLocking'});
        await Feature.create({name: 'ClimateControl'});
        res.send('Features saved successfully');
    } catch(e) {
        console.log(e);
        res.status(500).send('Error while saving features');
    }
})



module.exports = router