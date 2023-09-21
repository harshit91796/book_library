const Book = require('../models/bookModel')
const User = require('../models/userModel')
const Review = require('../models/reviewModel')
const moment = require('moment');
const aws= require("aws-sdk")
const { isValidObjectId } = require('mongoose');
const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
};

let uploadFile= async ( file) =>{
    return new Promise( function(resolve, reject) {
     // this function will upload file to aws and return the link
     let s3= new aws.S3({apiVersion: '2006-03-01'}); // we will be using the s3 service of aws
 
     var uploadParams= {
         ACL: "public-read",
         Bucket: "classroom-training-bucket",  //HERE
         Key: "abc/" + file.originalname, //HERE 
         Body: file.buffer
     }
 
 
     s3.upload( uploadParams, function (err, data ){
         if(err) {
             return reject({"error": err})
         }
         console.log(data)
         console.log("file uploaded succesfully")
         return resolve(data.Location)
     })
 
     // let data= await s3.upload( uploadParams)
     // if( data) return data.Location
     // else return "there is an error"
 
    })
 }



async function createbook(req,res){
    try{
        const { title, excerpt, ISBN, category, subcategory, releasedAt } = req.body;
        const files = req.files
     console.log(files)

        if(files && files.length>0){
            let uploadedFileURL= await uploadFile( files[0] )
            // res.status(201).send({msg: "file uploaded succesfully", data: uploadedFileURL})
            req.body.bookCover = uploadedFileURL
        }
        else{
            res.status(400).send({ msg: "No file found2" })
        }
        
    const data = req.body;
    console.log(data)
    
    // if (!isValid(req.body.bookCover)) {
    //     return res.status(400).send({ status: false, message: "invalid title" });
    // }
    if (!isValid(title)) {
        return res.status(400).send({ status: false, message: "invalid title1" });
    }
    if (!isValid(excerpt)) {
        return res.status(400).send({ status: false, message: "invalid excerpt" });
    }
    if (!isValid(ISBN)) {
        return res.status(400).send({ status: false, message: "invalid ISBN" });
    }
    // const isbnRegex = /^(?=(?:\D*\d){13}(?:(?:\D*\d){3})?$)[\d-]+$/g;
    // if (!isbnRegex.test(ISBN)) {
    //     return res.status(400).send({ status: false, message: "invalid ISBN" });
    // }
    if (!isValid(subcategory)) {
        return res.status(400).send({ status: false, message: "invalid subcategory" });
    }
    if (!isValid(category)) {
        return res.status(400).send({ status: false, message: "invalid category" });
    }
    if (!isValid(releasedAt)) {
        return res.status(400).send({ status: false, message: "invalid1" });
    }
    //find book is already created or not 
    const unique = await Book.findOne({ title: title ,  ISBN: ISBN });
    console.log(unique)
    if (unique) {
        return re.status(400).send({ status: false, message: "Book is already exist" });
    }
    const trimReleasedAt = releasedAt.trim();
    if (moment(trimReleasedAt, "YYYY-MM-DD").format("YYYY-MM-DD") !== trimReleasedAt) {
        return res.status(400).send({ status: false, message: "Please enter the Date in the format of 'YYYY-MM-DD'." });

    }
    const createData = await Book.create(req.body);
    return res.status(201).send({ status: true, message: "Success", data: createData });

} catch (error) {
    return res.status(500).send({ status: false, message: error.message });
}

}

const getBook = async function (req, res) {
    try {
        const data = req.query
        const { userId, category, subcategory } = data;

        //checking userId is valid objectId or not

        if (!isValidObjectId(userId)) {
            return res.status(400).send({status: false, message: "userId is not valid"});
        }

        //check userID is exist in userModel or not 
        const findUserId = await User.findById(userId);
        if(!findUserId) {
            return res.status(404).send({status: false, message: "data does not found according to userId"});
        }

        //find data
        const findData = await Book.find({...data ,isDeleted: false});
        console.log(findData)
        // console.log(newData)
        if(findData.length == 0) {
            return res.status(404).send({status: false, message: "page does not found"});
        }
        return res.status(200).send({status: true, data: findData });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}

const getBookById = async function (req, res) {
    try {
        const data = req.params.bookId
        console.log(data)
        if (!isValidObjectId(data)) {
            return res.status(400).send({status: false, message: "bookId is not valid"});
        }

        //check userID is exist in userModel or not 
        const findBook = await Book.findOne({_id : data, isDeleted : false});
        if(!findBook) {
            return res.status(404).send({status: false, message: "data does not found according to bookId"});
        }

        //find data
        const findReviews = await Review.find({bookId : data});
        const newData = {
            findBook,
            reviewsData : findReviews

        }
        return res.status(200).send({status: true, data: newData });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}

const updateBook = async function (req, res) {
    try {
        const bookId = req.params.bookId
        console.log(bookId)
        const {  title, excerpt, ISBN , releasedAt } = req.body
        let updateData = {};

        if (title) {
            if (!isValid(title)) {
                return res.status(400).send({ status: false, message: "Title is not Valid." });
            }

            const checkTitle = await Book.findOne({ title: title });

            if (checkTitle) {
                return res.status(400).send({ status: false, message: `The title ${title} is already is in use for a Book.Try another one.` });
            }

            updateData.title = title;
        }

        if (excerpt) {
            if (!isValid(excerpt)) {
                return res.status(400).send({ status: false, message: "Excerpt is not Valid" });
            }
            updateData.excerpt = excerpt;
        }

        if (ISBN) {
            if (!isValid(ISBN)) {
                return res.status(400).send({ status: false, message: "ISBN is not valid" });
            }

            if (!validateISBN(ISBN)) {
                return res.status(400).send({ status: false, message: " Invalid ISBN number it should contain only 13 digits" });
            }

            const checkISBN = await Book.findOne({ ISBN: ISBN });

            if (checkISBN) {
                return res.status(400).send({ status: false, message: `The ISBN ${ISBN} is already is in use for a Book.Try another one.` });
            }

            updateData.ISBN = ISBN;
        }

        if (releasedAt) {

            if (!isValid(releasedAt)) {
                return res.status(400).send({ status: false, message: "releasedAt must be in string" });
            }

            if (moment(releasedAt, "YYYY-MM-DD").format("YYYY-MM-DD") !== releasedAt) {
                return res.status(400).send({ status: false, message: "Please enter the Date in the format of 'YYYY-MM-DD'." });
            }

            updateData.releasedAt = releasedAt;
        }
        

        //checking the the book is present or not with that bookId

        const findBook = await Book.findOne({_id : bookId, isDeleted : false});
        if(!findBook) {
            return res.status(404).send({status: false, message: "data does not found according to bookId"});
        }


        //check userID is exist in userModel or not 
        const updateBook = await Book.findByIdAndUpdate(bookId,updateData,{new : true});



        return res.status(200).send({status: true, data: updateBook });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}
    
const deleteBook = async function (req, res) {
    try {
        const bookId = req.params.bookId

        if (!isValidObjectId(bookId)) {
            return res.status(400).send({status: false, message: "bookId is not valid"});
        }
          
 
        //checking the the book is present or not with that bookId

        const findBook = await Book.findOne({_id : bookId, isDeleted : false});
        if(!findBook) {
            return res.status(404).send({status: false, message: "data does not found according to bookId"});
        }


        //check userID is exist in userModel or not 
        const deleteBook = await Book.findByIdAndUpdate(bookId,{$set : {isDeleted : true}},{new : true});


        return res.status(200).send({status: true, data: deleteBook });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}





module.exports = {createbook,createbook,getBook,getBookById,updateBook,deleteBook}