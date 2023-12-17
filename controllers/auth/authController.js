import Joi from 'joi';
import bcrypt from 'bcrypt';
import { User } from '../../models';
import  Jwt  from 'jsonwebtoken';
import { SECRET } from '../../config';

const authController = {

      async register(req,res) {

                const regiserSchma = Joi.object({
                        name:Joi.string().min(5).max(30).required(),
                        email:Joi.string().email().required(),
                        mobile:Joi.string().required(),
                        password:Joi.string().required(),
                        confirm_password:Joi.ref('password')       

                })
                
              const { error } = regiserSchma.validate(req.body);  
              if(error){
                 return res.json({message:error.message,status:false})
              }
             
              const { name,email,mobile,password} = req.body;
               
              
               
               const exist = await User.exists({email:email});

               try{
                        if(exist){
                                return res.json({message:"User exist",status:false})           
                        }

               }catch(error){

                        return res.json({message:error.message,status:false})
               }

               let hashpassword =  await bcrypt.hash(password,10);

               const user =  new User({
                name,
                email,
                password:hashpassword,
                mobile,
    
    
                 });
            let token;
            try{
               
                const result = await user.save();// insert 
                token = Jwt.sign({_id: result._id,roles : result.roles},SECRET)
                //console.log(token);
            }
            catch(err){
              return  res.json({status:false,message:err.message})   
            }

            return  res.json({status:true,token:token,message:"register success"})   


        },

     async  login(req,res){
              
                const loginSchema = Joi.object({
                        email:Joi.string().email().required(),
                        password:Joi.string().required()
           
                   })
                    
                   const { error } = loginSchema.validate(req.body);
                   if(error){
                      return  res.json({message:error.message,status:false})
                       
                   }
                   let token;
                   try {
                       const userData = await User.findOne({email:req.body.email});
                       if(!userData){
                            return  res.json({message:'invalid email id',status:false})
           
                       }
           
                       const match = await bcrypt.compare(req.body.password, userData.password);
                       if(!match){
                            return  res.json({message:'invalid login password',status:false})
                       }
           
                       token = Jwt.sign({_id: userData._id,roles : userData.roles},SECRET)  
                       return res.status(200).json({token:token,status:true,message:'User login successful'})
           
                   } catch(error){
           
                         return  res.json({message:error.message,status:false})
                   }
       }




}

export default authController;