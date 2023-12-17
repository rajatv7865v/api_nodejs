import  Jwt  from "jsonwebtoken";
import { SECRET } from '../config'

const auth  = async (req,res,next)=> {

   const authheader = req.headers.authorization ;   

 if(!authheader){
        return res.json({message:'not authorization'});
 }

  const token = authheader.split(' ')[1];

 try{
    const {_id,role} = await Jwt.verify(token,SECRET);
    req.user ={};
    req.user._id = _id;
    req.user.role = role;
    next();   

 }
    catch(err){
        return res.json({message:err.message});
 }


}
 
export default auth;