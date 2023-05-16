const express = require('express')
const path = require('path')
const port = process.env.PORT || 3000
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const publicDirectory = path.join(__dirname, '../public')
const uploadsDirectory = path.join(__dirname, '../uploads')
const viewsDirectory = path.join(__dirname, '../templates')

const carRouter = require('./routers/car')
const adminRouter = require('./routers/admin')

const app = express()

app.set('view engine', 'ejs')
app.set('views', viewsDirectory)

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.json())
app.use(express.static(publicDirectory))
app.use(express.static(uploadsDirectory))
app.use(cookieParser())

app.use(carRouter)
app.use('/admin', adminRouter)

app.listen(port, () => {
    console.log(`Server is up on ${port}`)
})