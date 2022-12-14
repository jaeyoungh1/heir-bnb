// let  singlePublicFileUpload = require('../../awsS3')
let { singleMulterUpload, singlePublicFileUpload, multipleMulterUpload, multiplePublicFileUpload } = require('../../awsS3')
'use strict'; //delete later if needed

const express = require('express')
const router = express.Router();

const { check, param } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User, Spot, Review, Booking, SpotImage, ReviewImage, sequelize } = require('../../db/models');

const { Op } = require("sequelize")

const validatePagination = [
    check('page')
        .custom(val => {
            if (!val) return true
            if (val) {
                val = parseInt(val)
                if (Number.isInteger(val) && val >= 0 && val <= 10) return true
            }
        })
        .withMessage("Page must be greater than or equal to 0"),
    check('size')
        .custom(val => {
            if (!val) return true
            if (val) {
                val = parseInt(val)
                if (Number.isInteger(val) && val >= 0 && val <= 10) return true
            }
        })
        .withMessage("Size must be greater than or equal to 0"),
    check('minLat')
        .custom(val => {
            if (!val) return true
            if (val) {
                if (!isNaN(val) && val.includes('.')) return true
            }
        })
        .withMessage("Minimum latitude is invalid",),
    check('maxLat')
        .custom(val => {
            if (!val) return true
            if (val) {
                if (!isNaN(val) && val.includes('.')) return true
            }
        })
        .withMessage("Maximum latitude is invalid",),
    check('minLng')
        .custom(val => {
            if (!val) return true
            if (val) {
                if (!isNaN(val) && val.includes('.')) return true
            }
        })
        .withMessage("Minimum longitude is invalid"),
    check('maxLng')
        .custom(val => {
            if (!val) return true
            if (val) {
                if (!isNaN(val) && val.includes('.')) return true
            }
        })
        .withMessage("Maximum longitude is invalid"),
    check('minPrice')
        .custom(val => {
            if (!val) return true
            if (val) {
                if (val > 0) return true
            }
        })
        .withMessage("Minimum price must be greater than or equal to 0"),
    check('maxPrice')
        .custom(val => {
            if (!val) return true
            if (val) {
                if (val > 0) return true
            }
        })
        .withMessage("Maximum price must be greater than or equal to 0"),

    handleValidationErrors
];
//get all spots
router.get('/', validatePagination, async (req, res, next) => {
    let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query
    let pagination = {}
    let where = {}

    if (!page) page = 1;
    if (!size) size = 0
    if (!minPrice) minPrice = 0;
    if (!maxPrice) maxPrice = 0;
    // console.log('this is the console log for page', page)
    // console.log('this is the console log for size', size)

    page = parseInt(page)
    size = parseInt(size)
    // pagination.limit = size;
    // pagination.offset = size * (page - 1)
    // if (pagination.offset < 0) pagination.offset = 0

    minLat = parseInt(minLat)
    maxLat = parseInt(maxLat)
    minLng = parseInt(minLng)
    maxLng = parseInt(maxLng)
    minPrice = parseInt(minPrice)
    maxPrice = parseInt(maxPrice)

    if (minPrice) {
        where.price = { [Op.gte]: minPrice }
    }
    if (minLat) {
        where.lat = { [Op.gte]: minLat }
    }
    if (minLng) {
        where.price = { [Op.gte]: minLng }
    }
    if (maxPrice) {
        where.price = { [Op.lte]: maxPrice }
    }
    if (maxLat) {
        where.lat = { [Op.lte]: maxLat }
    }
    if (maxLng) {
        where.price = { [Op.lte]: maxLng }
    }

    const spots = await Spot.findAll({
        order: [['id']],
        include: [
            {
                model: Review,
                attributes: [],
            }
        ],
        ...pagination,
        where,
        subQuery: false,
        duplicating: false,
        attributes: {
            include: [
                [
                    sequelize.fn('ROUND', sequelize.fn("AVG", sequelize.col("Reviews.stars")), 2),
                    "avgRating"
                ]
            ],
        },
        group: ["Spot.id"],
        // group: ["Spot.id", "SpotImages.url"],
        raw: true
    });

    let Spots = []

    for (let i = 0; i < spots.length; i++) {
        let previewImage = await SpotImage.findAll({
            where: {
                spotId: spots[i].id,
                preview: true
            },
            attributes: ['url']
        })
        let url;
        let previewImgObj = await previewImage[0]

        if (previewImgObj) {
            let imgobj = await previewImgObj.toJSON()
            url = imgobj.url
        } else url = null
        // console.log(url)
        let spotObj = await spots[i]
        spotObj.previewImage = url
        Spots.push(spotObj)
    }

    let result = {}
    result.Spots = Spots;
    // result.page = page 
    // result.size = size 

    return res.json(result)
    // return res.json({Spots: spots, page, size})
})

//get all spots from current user
router.get('/current', requireAuth, restoreUser, async (req, res, next) => {
    const { user } = req;
    let currentUser = user.toSafeObject()
    let currentUserId = currentUser.id
    const spots = await Spot.findAll({
        order: [['id']],
        where: { ownerId: currentUserId },
        include: [
            {
                model: Review,
                attributes: []
            }
        ],
        attributes: {
            include: [
                [
                    sequelize.fn('ROUND', sequelize.fn("AVG", sequelize.col("Reviews.stars")), 2),
                    "avgRating"
                ]
            ]
        },
        group: ["Spot.id"],
        raw: true
    })

    let Spots = []

    for (let i = 0; i < spots.length; i++) {
        let previewImage = await SpotImage.findAll({
            where: {
                spotId: spots[i].id,
                preview: true
            },
            attributes: ['url']
        })
        let url;
        let previewImgObj = await previewImage[0]

        if (previewImgObj) {
            let imgobj = await previewImgObj.toJSON()
            url = imgobj.url
        } else url = null
        // console.log(url)
        let spotObj = await spots[i]
        spotObj.previewImage = url
        Spots.push(spotObj)
    }

    let result = {}
    result.Spots = Spots;

    return res.json(result)


    // return res.json({ Spots: spots })
})

//get spots details by id
router.get('/:spotId', async (req, res, next) => {
    //404 if ID not found hmmm messy bc of eagerloading
    let spot = await Spot.findByPk(req.params.spotId)
    if (!spot) {
        res.status(404)
        return res.json({
            "message": "Spot couldn't be found",
            "statusCode": res.statusCode
        })
    }

    const spots = await Spot.findByPk(req.params.spotId)

    const avgReview = await Review.findAll({
        where: { spotId: req.params.spotId },
        attributes: [[
            sequelize.fn("AVG", sequelize.col("stars")),
            "avgStarRating"
        ]]
    })

    const images = await Spot.findByPk(req.params.spotId, {
        include: {
            model: SpotImage,
            attributes: ['id', 'url', 'preview']
        }
    })

    const owner = await Spot.findByPk(req.params.spotId, {
        include: {
            model: User,
            attributes: ['id', 'firstName', 'lastName']
        },
    })
    const numReviews = await Review.count({
        where: { spotId: spot.id }
    })
    let avgRating = await avgReview[0]
    let average = await avgRating.toJSON()
    let averageNum = Number(average.avgStarRating).toFixed(2)
    if (averageNum == "0.00") averageNum = null

    const result = await spots.toJSON()
    result.avgStarRating = averageNum
    result.numReviews = numReviews
    result.SpotImages = images.SpotImages
    result.Owner = owner.User

    // res.json(await images.SpotImages)
    return res.json(result)
})

const validateSpotBody = [
    check('address')
        .exists({ checkFalsy: true })
        .withMessage('Street address is required'),
    check('city')
        .exists({ checkFalsy: true })
        .withMessage('City is required'),
    check('state')
        .exists({ checkFalsy: true })
        .withMessage('State is required'),
    check('country')
        .exists({ checkFalsy: true })
        .withMessage('Country is required'),
    check('lat')
        .exists({ checkFalsy: true })
        .isDecimal()
        .withMessage('Latitude is not valid'),
    check('lng')
        .exists({ checkFalsy: true })
        .isDecimal()
        .withMessage('Longitude is not valid'),
    check('name')
        .exists({ checkFalsy: true })
        .isLength({ min: 0, max: 50 })
        .withMessage('Name must be less than 50 characters'),
    check('description')
        .exists({ checkFalsy: true })
        .withMessage('Description is required'),
    check('price')
        .exists({ checkFalsy: true })
        .withMessage('Price per day is required'),
    handleValidationErrors
];

//create spot
router.post('/',
    requireAuth,
    validateSpotBody,

    async (req, res, _next) => {
        const { user } = req;
        let currentUser = user.toSafeObject()
        let currentUserId = currentUser.id

        let { address, city, state, country, lat, lng, name, description, price } = req.body

        const newSpot = await Spot.create({
            ownerId: currentUserId,
            address: address,
            city: city,
            state: state,
            country: country,
            lat: lat,
            lng: lng,
            name: name,
            description: description,
            price: price
        })
        return res.json(newSpot)
    })

//edit spot based on spotid
router.put('/:spotId/',
    requireAuth,
    validateSpotBody,
    async (req, res, next) => {

        const spot = await Spot.findByPk(req.params.spotId, {
            attributes: { exclude: ['previewImage'] } // remove this later
        })
        //unable to find spot error
        if (!spot) {
            res.status(404)
            return res.json({
                "message": "Spot couldn't be found",
                "statusCode": res.statusCode
            })
        }
        //unauthorized editor 
        const { user } = req;
        let currentUser = user.toSafeObject()
        let currentUserId = currentUser.id

        if (currentUserId !== spot.ownerId) {
            res.status(403)
            return res.json({
                "message": "Forbidden",
                "statusCode": 403
            })
        }


        let { address, city, state, country, lat, lng, name, description, price } = req.body

        spot.set({
            address: address,
            city: city,
            state: state,
            country: country,
            lat: lat,
            lng: lng,
            name: name,
            description: description,
            price: price
        })

        await spot.save()
        return res.json(spot)
    })

//add image to spot based on spotid
router.post('/:spotId/images',
    singleMulterUpload("image"),
    // multipleMulterUpload('images'),
    requireAuth, async (req, res, next) => {

        // console.log("BEING HIT")
        const spot = await Spot.findByPk(req.params.spotId)
        

        if (!spot) {
            res.status(404)
            return res.json({
                "message": "Spot couldn't be found",
                "statusCode": res.statusCode
            })
        }
        const { user } = req;
        let currentUser = user.toSafeObject()
        let currentUserId = currentUser.id

        if (currentUserId !== spot.ownerId) {
            res.status(403)
            return res.json({
                "message": "Forbidden",
                "statusCode": 403
            })
        }

        const { preview } = req.body;
        // console.log('>>>>> REQBODY', req.body, preview)
        // console.log('>>>>> REQBODY', req.file)
        // console.log('>>>>> REQFILE', await singlePublicFileUpload(req.file))

        // console.log("REQFILE", req.file)
        
        try {
            const tryUrl = await singlePublicFileUpload(req.file);
            console.log(tryUrl)
        } catch(err) {
            console.log('ERROR:', err)
            // console.log("I shouldnt be hit at all my dude")
        }

        const url = await singlePublicFileUpload(req.file);
        // console.log(">>>>> INSIDE STORE URL", url)

        const newImg = await spot.createSpotImage({
            url: url,
            preview: preview
        })

        const result = await SpotImage.findByPk(newImg.id, {
            attributes: { exclude: ['spotId', 'updatedAt', 'createdAt'] }
        })

        return res.json(result)
    })

//get spot's reviews
router.get('/:spotId/reviews', async (req, res, next) => {
    const spot = await Spot.findByPk(req.params.spotId)

    if (!spot) {
        res.status(404)
        return res.json({
            "message": "Spot couldn't be found",
            "statusCode": res.statusCode
        })
    }

    const reviews = await spot.getReviews({
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            }
        ]
    })
    let Reviews = await reviews
    return res.json({ Reviews })
})

const validateReviewBody = [
    check('review')
        .exists({ checkFalsy: true })
        .withMessage('Review text is required'),
    check('stars')
        .isInt({ min: 1, max: 5 })
        .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
];

//create a review for a spot
router.post('/:spotId/reviews', requireAuth, validateReviewBody, async (req, res, next) => {
    const spot = await Spot.findByPk(req.params.spotId)
    const { review, stars } = req.body;

    if (!spot) {
        res.status(404)
        return res.json({
            "message": "Spot couldn't be found",
            "statusCode": res.statusCode
        })
    }

    const { user } = req;
    let currentUser = user.toSafeObject()
    let currentUserId = currentUser.id

    const existingReview = await Review.findAll({
        where: {
            userId: currentUserId,
            spotId: req.params.spotId
        }
    })
    if (existingReview.length > 0) {
        res.status(403)
        return res.json({
            "message": "User already has a review for this spot",
            "statusCode": res.statusCode
        })
    }

    const newReview = await Review.create({
        userId: currentUserId,
        spotId: req.params.spotId,
        review: review,
        stars: stars
    })

    return res.json(newReview)
})

//get spot's bookings by id
router.get('/:spotId/bookings', requireAuth, async (req, res, next) => {
    const { user } = req;
    let currentUser = user.toSafeObject()
    let currentUserId = currentUser.id

    const spot = await Spot.findByPk(req.params.spotId)

    if (!spot) {
        res.status(404)
        return res.json({
            "message": "Spot couldn't be found",
            "statusCode": res.statusCode
        })
    }

    if (currentUserId == spot.ownerId) {
        const bookings = await spot.getBookings({
            order: [['id']],
            // include: [
            //     {
            //         model: User,
            //         attributes: ['id', 'firstName', 'lastname']
            //     }
            // ],
            // group: ["Spot.id"],
            // raw: true;
        })

        let Bookings = []

        for (let i = 0; i < bookings.length; i++) {
            let user = await User.findByPk(bookings[i].userId,
                { attributes: ['id', 'firstName', 'lastName'] }
            )

            let userObj = await user.toJSON()

            let book = await bookings[i]

            let bookObj = await book.toJSON()
            bookObj.User = userObj
            Bookings.push(bookObj)
        }

        return res.json({ Bookings })
    }

    const bookings = await spot.getBookings({
        attributes: ['spotId', 'startDate', 'endDate']
    })
    let Bookings = await bookings
    return res.json({ Bookings })
})


//create a new booking
router.post('/:spotId/bookings', requireAuth, async (req, res, next) => {
    const { user } = req;
    let currentUser = user.toSafeObject()
    let currentUserId = currentUser.id

    const spot = await Spot.findByPk(req.params.spotId)

    if (!spot) {
        res.status(404)
        return res.json({
            "message": "Spot couldn't be found",
            "statusCode": res.statusCode
        })
    }

    if (currentUserId === spot.ownerId) {
        res.status(403)
        return res.json({
            "message": "Forbidden",
            "statusCode": 403
        })
    }

    const { startDate, endDate } = req.body

    const bookings = await spot.getBookings()

    let errors = {}

    if (startDate > endDate) {
        let err = new Error("Validation error")
        err.status = 400
        errors.endDate = "endDate cannot be on or before startDate"
        err.errors = errors
        return next(err)
    }

    for (let i = 0; i < bookings.length; i++) {
        if ((startDate >= bookings[i].startDate && startDate <= bookings[i].endDate) ||
            (endDate >= bookings[i].startDate && endDate <= bookings[i].endDate)) {
            let err = new Error("Sorry, this spot is already booked for the specified dates")
            err.status = 403
            if ((startDate >= bookings[i].startDate && startDate <= bookings[i].endDate)) {

                errors.startDate = "Start date conflicts with an existing booking"
            }
            if ((endDate >= bookings[i].startDate && endDate <= bookings[i].endDate)) {

                errors.endDate = "End date conflicts with an existing booking"
            }
            err.errors = errors
            return next(err)

        }
    }

    const newBooking = await Booking.create({
        startDate: startDate,
        endDate: endDate,
        userId: currentUserId,
        spotId: spot.id
    })
    return res.json(newBooking)
})

//delete spot
router.delete('/:spotId', requireAuth, async (req, res) => {
    const spot = await Spot.findByPk(req.params.spotId)

    // no spot id error
    if (!spot) {
        res.status(404)
        return res.json({
            "message": "Spot couldn't be found",
            "statusCode": res.statusCode
        })
    }
    //unauthorized editor 
    const { user } = req;
    let currentUser = user.toSafeObject()
    let currentUserId = currentUser.id

    if (currentUserId !== spot.ownerId) {
        res.status(403)
        return res.json({
            "message": "Forbidden",
            "statusCode": 403
        })
    }

    await spot.destroy()

    res.status(200)
    return res.json({
        "message": "Successfully deleted",
        "statusCode": res.statusCode
    })
})

module.exports = router;