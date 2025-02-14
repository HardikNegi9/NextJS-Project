import mongoose from "mongoose";

type ConnectionOptions = {
    isConnected?: number;
}

const connection: ConnectionOptions = {};

export async function dbConnect(): Promise<void> { // void is used to indicate that we dont care what type of value is been returned
    if (connection.isConnected) {
        console.log("Using existing connection");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI!);
        connection.isConnected = db.connections[0].readyState;        
        console.log("DB Connected");

    } catch (error) {
        console.log("DB Connection Error: ", error);

        process.exit(1);
    }
}

export default dbConnect;