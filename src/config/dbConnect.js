import { connect } from "mongoose";

const dbConnect = async () => {
  try {
    const mongodbConnection = await connect(
      process.env.MONGO_STRING
    );
    console.log(`Database connected: ${mongodbConnection.connection.host}`)

  } catch (error) {
    console.log(`Database connection error---: ${error}`);
    process.exit(1);
  }
};

export default dbConnect;
