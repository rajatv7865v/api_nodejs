import express from 'express';
import { APP_PORT,DBURL } from './config/index'
import route from './routes';
import mongoose from 'mongoose';
import path from 'path';
import cors from 'cors';
const app = express();
  
global.appRoot = path.resolve(__dirname);
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/api',route); 
app.use('/uploads', express.static('uploads'));  

//Database connection
mongoose.connect(DBURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('DB connected...');
});

app.listen(APP_PORT,()=>{

    console.log(`server is running on port ${APP_PORT}`);

})
