const express = require("express");
const router = express.Router();
const cors = require("cors");
const app = express();
const zod = require("zod");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const token = "mytoken";
const {Signup, Ticket} = require("./schema");
const { signupSchema } = require("./zodSchema");

// Middleware setup
router.use(express.json()); // Parse incoming JSON data
router.use(cors()); // Enable Cross-Origin Resource Sharing (CORS)
//Endpoint for signup and adding it to the database.
router.post("/signup",async(req, res) => {
  try{
    const body = req.body;
    const validateZod = signupSchema.safeParse(body);
    if(!validateZod.success){
      return res.status(400).json({message:validateZod.error.errors});
    }

    const {name,email,password,mobile,address,city,state} = req.body;
    const hashedPassword = await bcrypt.hash(password,10);
    const find = await Signup.findOne({email:email});
    if(find){
      return res.status(400).json({message:"Email already exists"});
    }
  
    const signup = await  Signup.create ({
      name,
      email,
      password:hashedPassword,
      mobile,
      address,
      city,
      state,
      });
      if(signup){
        const authToken = jwt.sign({email:email}, token);
        return res.status(200).json({
          token:authToken,
          message:"Signup successful"
        });
      }
  }catch(error){
    res.status(500).json({message:"Something went wrong! Please try again."});
  }
  
})

router.post("/login",async(req,res) => {
  try{
    const {email,password} = req.body;
    const find = await Signup.findOne({email:email});
    if(!find){
      console.log("inside if")
      return res.status(400).json({
        message:"Email not found"
      });
    }
    console.log(find);
    const hashed =  await bcrypt.compare(password,find.password);
    if(!hashed){
      return res.status(400).json({
        message:"Incorrect password"
      });
    }
    const jwtToken = jwt.sign({email:email},token);
    return res.status(200).json({
      token:jwtToken,
      message:"Login successful"
    });
  }
  catch(error){
    res.status(500).json({
      message:"Something went wrong! Please try again."
    });
  }
})


// Endpoint for creating a new booking and adding it to the database.
router.post("/booking", async (req, res) => {
  const { movie, slot, seats } = req.body;

  try {
    // Create a new Ticket instance using the provided data
    const myData = new Ticket({ movie, slot, seats });

    // Save the Ticket instance to the database
    const saved = await myData.save();

    // Respond with success message and the saved data
    res.status(200).json({ data: myData, message: "Booking successful!" });
  } catch (error) {
    // Handle errors and respond with an error message
    res.status(500).json({
      data: null,
      message: "Something went wrong! Please try again.",
    });
  }
});

// Endpoint for getting the last booking details from the database and sending it to the frontend.
router.get("/booking", async (req, res) => {
  try {
    // Retrieve the last booking by sorting in descending order and limiting to 1 result
    const myData = await Ticket.find().sort({ _id: -1 }).limit(1);

    if (myData.length === 0) {
      // No booking found, respond with appropriate message
      res.status(200).json({ data: null, message: "No previous booking found!" });
    } else {
      // Respond with the last booking details
      res.status(200).json({ data: myData[0] });
    }
  } catch (error) {
    // Handle errors and respond with an error message
    res.status(500).json({
      data: null,
      message: "Something went wrong! Please try again.",
    });
  }
});

module.exports = router;
