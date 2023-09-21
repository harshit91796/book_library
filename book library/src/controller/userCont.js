const User = require("../models/userModel");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')


const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};
const createUser = async function (req, res) {
  try {
    const { title , name, phone, email, address,password} = req.body
    
    
  if(req.body === null){
   return res.status(400).send({status : false, msg : "enter the data of user"})
  }
  if(!["Mr", "Mrs", "Miss"].includes(title)){
    return  res.status(400).send({status : false, msg : "title required" })
  }
  if (!isValid(title)) {
    return res.status(400).send({ status: false, message: "invalid excerpt" });
}
   if(!address){
    return  res.status(400).send({status : false, msg : "address required" })
   }
   if(address === null){
      
    return  res.status(400).send({status : false, msg : "address required" })
   }
   const {street,city,pincode} = address
  if(!street){
    return  res.status(400).send({status : false, msg : "street required" })
  }
  if(!city){
    return  res.status(400).send({status : false, msg : "city required" })
  }
  if(!pincode){
    return  res.status(400).send({status : false, msg : "pincode required" })
  }

  if(!name){
   return  res.status(400).send({status : false, msg : "name required"})
  }
  if(!phone){
   return  res.status(400).send({status : false, msg : "mobile required"})
  }
  if(!email){
   return res.status(400).send({status : false, msg : "email required"})
  }

 const mobileDublicate = await User.findOne({ phone: phone})

 if(mobileDublicate){
    return res.status(400).send({status : false, msg : "mobile is already registered"})
   }


 const emailDublicate = await User.findOne({ email: email})
 if(emailDublicate){
    return res.status(400).send({status : false, msg : "email is already registered"})
   }

 
 await User.create(req.body)

 res.status(201).send({status : true , data : req.body , msg : "succesfully created"})
  } catch (error) {
    if (error.message.includes("validation")) {
      return res.status(400).send({ status: false, message: error.message })
  }
    return res.status(500).send({err : error.message})
  }
}


async function login(req,res){
    try {
        const {email, password} = req.body

    if(!email){
        return res.status(400).send({status : false, msg : "email required"})
       }
    if(!password){
        return res.status(400).send({status : false, msg : "password required"})
    }
    
 
      const data = await User.findOne({ email: email})
     
     if(!data){
         return res.status(400).send({status : false, msg : "no data with that user"})
        }
     
     const hashed = await bcrypt.compare(password,data.password)

     if(hashed){
           const token = jwt.sign({userId : data._id},process.env.JWT_KEY)
           res.setHeader('X-api-key',token)
           res.status(200).send({status : true, data : token})

     }
    } catch (error) {
        if (error.message.includes("validation")) {
            return res.status(400).send({ status: false, message: error.message })
        }
          return res.status(500).send({err : error.message})
    }

   }


   module.exports = {createUser,login}



   