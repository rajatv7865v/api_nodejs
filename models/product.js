import mongoose from "mongoose";
const schema  = mongoose.Schema;

const productSchema = new schema({
    name:{type :String,required:true},
    price:{ type:String, required: true},
    size:{ type: String, required : true},
    image:{ type: String}        
},{timestamps:true});

export default mongoose.model('Product',productSchema,'products');