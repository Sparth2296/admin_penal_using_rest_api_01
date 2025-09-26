const AdminSchema = require('../model/adminModel');
const moment = require('moment');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path')
const fs = require('fs')
const nodemailer = require('nodemailer')


//======================== admin Regitration ===============================

module.exports.adminResgitration = async (req, res) => {
  try {

    const existingUser = await AdminSchema.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ msg: "This user is already registered!" });
    }
    
    console.log(req.body)
    const { first_name, last_name, email, username, password, phone } = req.body;
    
    if (!first_name || !last_name || !email || !username || !phone || !password) {
      return res.status(400).json({ msg: "All fields are required!" });
    }

    if (typeof password !== "string") {
      return res.status(400).json({ msg: "Password must be a string!" });
    }
    
    const hashPassword = await bcrypt.hash(password, 10);

      let imagePath = null;
      if (req.file) {
        imagePath = `${AdminSchema.adminImagePath}/${req.file.originalname}`;
      }
      
    const userData = {
      first_name, 
      last_name,
      email,
      username,
      phone,
      password: hashPassword,
      image: imagePath,
      create_date: moment().format("MMM Do YY"),
      update_date: moment().format("MMM Do YY"),
    };
    
    const createUser = await AdminSchema.create(userData);
    
    if (createUser) {
      return res.status(201).json({
        msg: "New user registered successfully!",
        data: userData,
      });
    } else {
      return res.status(500).json({
        msg: "User could not be registered. Try again.",
      });
    }
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server Error!!" });
  }
  
};

// ======================== admin Login =================

module.exports.loginAdmin = async (req , res) =>{
  try {

    console.log(req.body);
    
    
    const existingUser = await AdminSchema.findOne({ email: req.body.email});

    console.log(existingUser);
    
    if (existingUser) {
  
      if(await bcrypt.compare(req.body.password , existingUser.password)){

      
        const token = jwt.sign({ existingUser }, "AdminLogin123", { expiresIn: "1h" });

        console.log(token);
        return res.status(200).json({ msg: "User login Succssefully !!" });

        
      }else{
        
        return res.status(200).json({ msg: "Passwords is not match, Please try agein !!" });
      }
    }else{
      
      return res.status(400).json({ msg: "This user's Email Account is not Found !!!" });
    }
    


  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server Error!!" });
    
  }
}

//================================= admin Profile =============================

module.exports.viweAdminProfile = async (req , res )=>{
  try {

    res.status(200).json({msg : req.user})
    
    
  } catch (error) {
    console.log(error);
    res.status(500).json({msg : "Internal Server Error !!"})
  }
}

//  ====================== Edit Admin =============================

module.exports.adminProfileEdit = async (req , res ) =>{
 try {
  const _id = req.params._id; 

  const adminData = await AdminSchema.findById(_id)


  if(req.file){
    if(adminData.image){
      const oldPath = path.join(__dirname , adminData.image)

      if(fs.existsSync(oldPath)){
        fs.unlinkSync(oldPath)
      }
    }
  }

  const uploadImage = AdminSchema.adminImagePath + '/' + req.file.originalname;

  const updatedData = {
    ...req.body,
    image: uploadImage
  }

   const _idAdminUpdateData = await AdminSchema.findByIdAndUpdate(_id, updatedData , { new: true } ); // returns the updated document

  res.status(200).json({
    msg: "Admin data updated successfully!",
    data: _idAdminUpdateData
  });

  
} catch (error) {
  console.log(error);
  res.status(500).json({ msg: "Internal Server Error !!" });
}

}

// ======================= delete Admin ==================================

module.exports.adminDelete = async (req, res)=>{
    try {

        const _id = req.params._id

        console.log(_id);

        const deleteimage = await AdminSchema.findById(_id);


        fs.unlinkSync(`..${deleteimage.image}`)


        const deleteAdmin = await AdminSchema.findByIdAndDelete(_id);



        
        res.status(200).json({ msg: "Admin deleted succssefully !!" , data : deleteAdmin });
        
    } catch (error) {

         console.log(error);
  res.status(500).json({ msg: "Internal Server Error !!" });
        
    }
}

// ===============================change Password =================================
module.exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user._id; // coming from middleware

    const user = await AdminSchema.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found!" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Old password is incorrect!" });
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashPassword;
    await user.save();

    res.status(200).json({ msg: "Password changed successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server Error!!" });
  }
};

// =============================== Forgot Password (Send OTP) ===============================
module.exports.forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await AdminSchema.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "This Email is not registered!" });
    }

    // generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // save otp in db with expiry (5 minutes)
    user.resetOTP = otp;
    user.resetOTPExpire = Date.now() + 5 * 60 * 1000;
    await user.save();

    // send OTP via email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "yourEmail@gmail.com",
        pass: "yourAppPassword" // use App Password
      },
    });

    await transporter.sendMail({
      from: "yourEmail@gmail.com",
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    });

    res.status(200).json({ msg: "OTP sent to your email!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server Error!!" });
  }
};

// =============================== Reset Password (Verify OTP) ===============================
module.exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await AdminSchema.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User not found!" });
    }

    if (user.resetOTP !== otp || user.resetOTPExpire < Date.now()) {
      return res.status(400).json({ msg: "Invalid or expired OTP!" });
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashPassword;

    // clear OTP
    user.resetOTP = undefined;
    user.resetOTPExpire = undefined;

    await user.save();

    res.status(200).json({ msg: "Password reset successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server Error!!" });
  }
};
