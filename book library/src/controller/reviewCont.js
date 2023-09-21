const Book = require('../models/bookModel')
const User = require('../models/userModel')
const Review = require('../models/reviewModel')
const moment = require('moment');
const { isValidObjectId } = require('mongoose');
const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
};

const reviews = async function (req, res) {
    try {
        const data = req.params.bookId
        const { reviewedBy , rating , review,bookId } = req.body
        if (!isValidObjectId(data)) {
            return res.status(400).send({status: false, message: "bookId is not valid"});
        }
        if (!isValid(reviewedBy)) {
            return res.status(400).send({status: false, message: "reviewedby is not valid"});
        }
        if (!isValid(rating)) {
            return res.status(400).send({status: false, message: "rating is not valid"});
        }
        if (!isValid(review)) {
            return res.status(400).send({status: false, message: "review is not valid"});
        }
        if (!isValid(bookId)) {
            return res.status(400).send({status: false, message: "userId is not valid"});
        }

        //check userID is exist in userModel or not 
        const findBook = await Book.findById({_id : data, isDeleted : false});
        if(!findBook) {
            return res.status(404).send({status: false, message: "data does not found according to bookId"});
        }
        
        // create review
        const newData = {
            bookId : data,
            reviewedBy : reviewedBy,
            rating : rating,
            review : review,

            reviewedAt : new Date(Date.now())

        }
        
        await Review.create(newData)
        const updateBook = await Book.findByIdAndUpdate(bookId,{$inc : {reviews : 1}},{new : true});


        return res.status(200).send({status: true, data: newData });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}

const updateReviews = async function (req, res) {
    try {
        const data = req.params.reviewId
        const bookId = req.params.bookId
        const { reviewedBy , rating , review } = req.body
        let updateData = {};
        if (!isValidObjectId(data)) {
            return res.status(400).send({status: false, message: "bookId is not valid"});
        }
        if (!isValidObjectId(bookId)) {
            return res.status(400).send({status: false, message: "bookId is not valid"});
        }

        if (reviewedBy) {
            if (!isValid(reviewedBy)) {
                return res.status(400).send({ status: false, message: "reviwedby is not Valid." });
            }

            updateData.reviewedBy = reviewedBy;
        }

        if (rating) {
            if (!isValid(rating)) {
                return res.status(400).send({ status: false, message: "rating is not Valid" });
            }
            updateData.rating = rating;
        }

        if (review) {
            if (!isValid(review)) {
                return res.status(400).send({ status: false, message: "review is not valid" });
            }

            updateData.review = review;
        }

        
        //checking the the book is present or not with that bookId

        const findBook = await Book.findOne({_id : bookId, isDeleted : false});
        if(!findBook) {
            return res.status(404).send({status: false, message: "data does not found according to bookId"});
        }

        //checking the the review is present or not with that reviewId

        const findReviewByUser = await Review.findOne({_id : data , isDeleted : false});
        if(!findReviewByUser) {
            return res.status(404).send({status: false, message: "data does not found according to reviewId"});
        }


        //check userID is exist in userModel or not 
        const findReview = await Review.findByIdAndUpdate(data,updateData,{new : true});



        return res.status(200).send({status: true, data: findReview });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}

const deleteReview = async function (req, res) {
    try {
        const data = req.params.reviewId
        const bookId = req.params.bookId

        if (!isValidObjectId(bookId)) {
            return res.status(400).send({status: false, message: "bookId is not valid"});
        }
          
        if (!isValidObjectId(data)) {
            return res.status(400).send({status: false, message: "reviewedId is not valid"});
        }
        
        //checking the the book is present or not with that bookId

        const findBook = await Book.findOne({_id : bookId, isDeleted : false});
        if(!findBook) {
            return res.status(404).send({status: false, message: "data does not found according to bookId"});
        }

        //checking the the review is present or not with that reviewId

        const findReviewByUser = await Review.findOne({_id : data , isDeleted : false});
        if(!findReviewByUser) {
            return res.status(404).send({status: false, message: "data does not found according to reviewId"});
        }


        //check userID is exist in userModel or not 
        const findReview = await Review.findByIdAndUpdate(data,{$set : {isDeleted : true}},{new : true});


        return res.status(200).send({status: true, data: findReview });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}

module.exports = {reviews,updateReviews,deleteReview}