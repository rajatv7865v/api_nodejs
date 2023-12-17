
import { User } from '../../models';
const usersController = {


    async me(req,res){


        try{
            const user = await User.findOne({_id:req.user._id}).select('-password -createdAt -updatedAt -__v');   
            if(!user){
              return res.json({message:'user not found'})      
            }
              
            return res.json(user);      
      }catch(err){
          return res.json({message:err.message})            
      }

    }

}

export default usersController;