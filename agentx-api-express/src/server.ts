import { App } from '@/app';
import { AuthRoute } from '@routes/auth.route';
import { UserRoute } from '@routes/users.route';
import { ValidateEnv } from '@utils/validateEnv';
import { AIRoute } from './routes/ai.route';

ValidateEnv();

const app = new App([new AuthRoute(), new UserRoute(), new AIRoute()]);

try{
    
    app.listen();

}catch(err){
    console.error('Error Starting Server::', err)
}