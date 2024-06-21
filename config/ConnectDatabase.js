import mongoose from "mongoose"

const ConnectDatabase=async()=>{
try {
    const res=await mongoose.connect('mongodb://127.0.0.1:27017/smart-recipe');
    console.log(`database is connected with :${res.connection.host}`)
} catch (error) {
  console.log(`error is occured in connection with database`);

}
}
export default ConnectDatabase;
