const express = require('express')
const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
let { singleMulterUpload, singlePublicFileUpload, multipleMulterUpload, multiplePublicFileUpload } = require('../../awsS3')


const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User, Spot, Review, Booking, SpotImage, ReviewImage, sequelize } = require('../../db/models');

//get current user's reviews
router.get('/current', requireAuth, restoreUser, async (req, res, next) => {
    const { user } = req;
    let currentUser = user.toSafeObject()
    let currentUserId = currentUser.id

    const reviews = await Review.findAll({
        where: { userId: currentUserId },
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: Spot,
                attributes: { exclude: ['updatedAt', 'createdAt', 'description', 'avgRating'] }
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            }
        ]
    })
    let Reviews = []

    for (let i = 0; i < reviews.length; i++) {
        let previewImage = await SpotImage.findAll({
            where: {
                spotId: reviews[i].spotId,
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


        let reviewObj = await reviews[i]
        let reviewJSON = await reviewObj.toJSON()
        reviewJSON.Spot.previewImage = url
        Reviews.push(reviewJSON)
    }
    return res.json({ Reviews })
})

//adds an image to a user's review
router.post('/:reviewId/images', requireAuth,
    restoreUser,
    singleMulterUpload("image"),
    async (req, res, next) => {
        const { user } = req;
        let currentUser = user.toSafeObject()
        let currentUserId = currentUser.id

        const review = await Review.findByPk(req.params.reviewId)

        if (!review) {
            res.status(404)
            return res.json({
                "message": "Review couldn't be found",
                "statusCode": res.statusCode
            })
        }

        if (currentUserId !== review.userId) {
            res.status(403)
            return res.json({
                "message": "Forbidden",
                "statusCode": 403
            })
        }

        let allImages = await ReviewImage.findAll({
            where: { reviewId: req.params.reviewId }
        })
        if (allImages.length > 10) {
            res.status(403)
            return res.json({
                "message": "Maximum number of images for this resource was reached",
                "statusCode": res.statusCode
            })
        }

        try {
            const tryUrl = await singlePublicFileUpload(req.file);
            console.log(tryUrl)
        } catch (err) {
            console.log('ERROR:', err)
        }

        const url = await singlePublicFileUpload(req.file);
        console.log("URL BACKEND", url)

        const newImage = await review.createReviewImage({
            url: url
        })

        const result = await ReviewImage.findOne({
            where: { id: newImage.id },
            attributes: ['id', 'url']
        })
        return res.json(result)
    })

const validateReviewBody = [
    check('review')
        .exists({ checkFalsy: true })
        .withMessage('Review text is required'),
    check('stars')
        .isInt({ min: 1, max: 5 })
        .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
]

//update review
router.put('/:reviewId', requireAuth, restoreUser, validateReviewBody, async (req, res, next) => {
    const { user } = req;
    let currentUser = user.toSafeObject()
    let currentUserId = currentUser.id

    const currentReview = await Review.findByPk(req.params.reviewId)

    if (!currentReview) {
        res.status(404)
        return res.json({
            "message": "Review couldn't be found",
            "statusCode": res.statusCode
        })
    }

    if (currentUserId !== currentReview.userId) {
        res.status(403)
        return res.json({
            "message": "Forbidden",
            "statusCode": 403
        })
    }

    const { review, stars } = req.body

    currentReview.set({
        review: review,
        stars: stars
    })
    await currentReview.save()

    return res.json(currentReview)
})

//delete review
router.delete('/:reviewId', requireAuth, restoreUser, async (req, res, next) => {
    const { user } = req;
    let currentUser = user.toSafeObject()
    let currentUserId = currentUser.id

    const currentReview = await Review.findByPk(req.params.reviewId)

    if (!currentReview) {
        res.status(404)
        return res.json({
            "message": "Review couldn't be found",
            "statusCode": res.statusCode
        })
    }

    if (currentUserId !== currentReview.userId) {
        res.status(403)
        return res.json({
            "message": "Forbidden",
            "statusCode": 403
        })
    }

    await currentReview.destroy()

    res.status(200)
    return res.json({
        "message": "Successfully deleted",
        "statusCode": res.statusCode
    })
})

module.exports = router;