const router=require('express').Router();
const User=require('../models/User')
const cryptoJS=require('crypto-js')
const jwt=require('jsonwebtoken')

router.post('/register',async(req,res)=>{
    const newUser=new User({
        username:req.body.username,
        email:req.body.email,
        password:cryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(),
        isAdmin:req.body.isAdmin
    });
    try {
        const savedUser=await newUser.save();
        return res.status(201).json(savedUser);
    } catch (error) {
        return res.status(500).send('Error: '+error)
    }

})

router.post('/login',async(req,res)=>{
    try {
        const user=await User.findOne({username:req.body.username});
        if(!user) return res.status(401).json('wrong username')
        const hashedPassword=cryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);
        const originalPassword=hashedPassword.toString(cryptoJS.enc.Utf8);

        if(originalPassword!==req.body.password) return res.status(401).json('wrong password')

        const accessToken=jwt.sign({
            id:user._id,
            isAdmin:user.isAdmin
        },process.env.JWT_SEC,{expiresIn:"3d"})

        const{password,...others}=user._doc;
        return res.status(200).json({...others,accessToken})

    } catch (error) {
        return res.status(500).json(error);
    }
})

module.exports=router