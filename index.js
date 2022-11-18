import express from 'express';
//Template engine used to present data in browser
import hbs from 'hbs';
import flash from 'connect-flash';
import session from'express-session';
//To call and get data from APIs
import axios from 'axios';

//Import express routers here 
import assignmentAPIRouter from './src/routes/assignment.api.router.js';

//to keep common data
import dotenv from 'dotenv';
dotenv.config({path: './src/configs/.env'});

//to defined __dirname in ES module scope
import path  from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Create a instance of express library
const app = express();

//Use middleware in express to get data from request particularly from post method and encode it 
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(session({
    secret: 'abcdefgi12345689',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());

//Use hbs template engine and static paths
const static_path = path.join(__dirname, "/public");  //find index.html inside public if not found then run template/index.hbs
const template_path = path.join(__dirname, "views/templates");
const partial_path = path.join(__dirname, "views/partials");  
//If we are using HTML in public folder then set view engine html else hbs
app.use("/public", express.static(static_path));
/*using new template engine hbs*/
app.set('view engine', 'hbs');
app.set('views', template_path);
hbs.registerPartials(partial_path);
hbs.registerHelper('alterClass', function(index) {
    index = index % (arguments.length - 2); // -2 to leave out `index` and the final argument HB adds
    return arguments[index + 1];
});
hbs.registerHelper('toJSON', function(obj) {
    return JSON.stringify(obj, null, 3);
});
hbs.registerHelper('alterStatus', function(status) {
    return (status.toLowerCase() == "inactive") ? arguments[2] : arguments[1];
});

//Prepare server to listen
const PORT  = process.env.PORT || 7000;
app.listen(PORT, '0.0.0.0', (err, res)=>{
    if(err) throw err;
    console.log(`Application running on port http://localhost:${PORT}`);
});

//Create API's 
app.get('/', (req, res, next) => {
    res.render('index');
});

app.get('/task1', async(req, res)=>{
    res.render('task-view-page');
});

app.use('/task2', assignmentAPIRouter );

app.get('/api-data', async(req, res)=>{
    try{
        var result = {};
        const apiURL = process.env.DATA_API+process.env.CLIENT_CORPORATION_ID+process.env.BHRESTTOKEN;
        await axios.get(apiURL)
        .then((res) => {
            result.length = res.data.length;  
            result.data = res.data.data;        
        }).catch((err) =>  {
            console.log('error -',err.message);
        });
        res.send(result);
    }
    catch(err){
        console.log(err);
        //token=undefined;
        req.flash('message', "Token Expired! Please refresh token.");
        res.redirect("/index");
    }
});
