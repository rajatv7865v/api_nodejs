import express from 'express';
import { authController , usersController, productController} from '../controllers';
import auth from '../middleware/auth'

const route = express.Router();

route.post('/register',authController.register);
route.post('/login',authController.login);
route.post('/me',auth,usersController.me);
route.post('/products',productController.store);
route.get('/allProducts',productController.allProducts);




export default route;