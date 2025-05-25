import mongoose from "mongoose";

 const DB_Config = async () => {
  try {
    const url: string = String(process.env.DB_URL);
    await mongoose.connect(url);
    console.log("DB Connected Successfully.!");
  } catch (error) {
    console.log(error + " DB Error.! ");
    process.exit(0);
  }
};

export default DB_Config;