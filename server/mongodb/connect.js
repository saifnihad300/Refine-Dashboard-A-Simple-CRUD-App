import mongoose from 'mongoose'


const connectdb = (url) => {
    mongoose.set('strictQuery', true);


    mongoose.connect(url)
    .then(()=> console.log("Mongodb Connected"))
    .catch((error)=> console.log(error));
}

export default connectdb