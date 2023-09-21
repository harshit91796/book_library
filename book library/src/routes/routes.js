const express = require('express');
const {createUser,login} = require('../controller/userCont');
const {createbook,getBook,getBookById,updateBook,deleteBook} = require('../controller/bookCont');
const {reviews,updateReviews,deleteReview} = require('../controller/reviewCont');
const {auth,Authorisation,updateAuthorisation, hashpass} = require('../middleware/auth');
const aws= require("aws-sdk")
const router = express.Router();

router.post('/hello',(req,res) =>{
    console.log("helloooo")
    res.send({msg : "gjygjjg"})
})

aws.config.update({
    accessKeyId: "AKIAY3L35MCRZNIRGT6N",
    secretAccessKey: "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",
    region: "ap-south-1"
})



router.post('/register',hashpass, createUser);
router.post('/login',login)
router.post('/books',auth,createbook);
router.get('/books',auth, getBook);
router.get('/books/:bookId',auth,getBookById);
router.put('/books/:bookId',auth,updateAuthorisation,updateBook);
router.delete('/books/:bookId',auth,updateAuthorisation,deleteBook);
router.post('/books/:bookId/review',reviews);
router.put('/books/:bookId/review/:reviewId',updateReviews);
router.delete('/books/:bookId/review/:reviewId',deleteReview);




module.exports = router;