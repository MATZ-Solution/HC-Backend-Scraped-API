const mongoose=require('mongoose')

const citiesSchema= new mongoose.Schema(
    {
        state:{
            type:String
        },
        city:{
            type:String
        }

    }
);

module.exports=mongoose.model('allcities',citiesSchema)
