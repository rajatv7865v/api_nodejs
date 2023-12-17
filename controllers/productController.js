import multer from "multer";
import path from 'path';
import Joi from "joi";
import fs from 'fs';
import { Product } from "../models";
 

const storage  = multer.diskStorage({
    destination:(req,file,cb)=>cb(null,'uploads/'),
    filename:(req,file,cb)=>{
        const uniqueName = `${Date.now()}${path.extname(file.originalname)}`;
        cb(null,uniqueName);
    }


})

const handlerMultopartData = multer({storage,limits:{fileSize:10000000 * 5 }}).single('image');

 
const productController = {

         async store(req,res,next){
            handlerMultopartData(req,res,async  (err)=>{

                if(err){
                        return res.json({message:err.message});
                }  

                const filePath = req.file.path;    


                const productSchema = Joi.object({
                    name:Joi.string().required(),
                    price:Joi.string().required(),
                    size:Joi.string().required()
       
               })
                
               const { error } = productSchema.validate(req.body);
               if(error){
                    fs.unlink(`${appRoot}/${filePath}`,(err)=>{
                        if(err){
                            res.json({message:err.message,status:false})
                        }
                      
                    });
                  
                    res.json({message:error.message,status:false})
               }

               const { name, price, size } = req.body;
               let document;

               try{
                document = await Product.create({
                    name,
                    price,
                    size,
                    image: filePath
                });

               }catch(error){
                res.json({message:error.message,status:false})
               }

               res.json({message:'success',status:true,data:document})
                  

            })
            
        },

        async allProducts(req,res){


            try{
                const user = await Product.find().select('-createdAt -updatedAt -__v');   
                if(!user){
                  return res.json({message:'Product not found'})      
                }
                  
                return res.json(user);      
          }catch(err){
              return res.json({message:err.message})            
          }
    
        }
        



}

export default productController;