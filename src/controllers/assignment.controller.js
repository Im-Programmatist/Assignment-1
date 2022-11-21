//To call and get data from APIs
import axios from 'axios';

const refreshToken = async() =>{
    axios.get(process.env.TOKEN_API,{
        headers: {
            'Content-Type' : 'application/json',
            'Authorization' : 'Basic dXNlci50ZXN0OlBhc3N3b3JkQDEyMw==' //the token is a variable which holds the token
        }
    })
    .then((res) => {
        if(res.data.statusCode == 200){
            console.log('refresh token resoonse', res.data.response);
            process.env['BHRESTTOKEN'] = res.data.response.bhRestToken;
        }      
    }).catch((err) =>  {
        console.log('refresh token error', err);
    })
}

async function fetch(req, res, next) {
    
    try{
        var result = {};
        var token = process.env.BHRESTTOKEN;
        var url = 'https://rest99.bullhornstaffing.com/rest-services/70lqp0/query/ClientCorporationCustomObjectInstance5?fields=id,text11,textBlock5,textBlock3,text9,text3,text4&where=text11%20IS%20NOT%20NULL%20AND%20clientCorporation.id%20=%20318253&BhRestToken='+token;
        await axios.get(url)
        .then((res) => {
            result.length = res.data.data.length;  
            result.data = res.data.data;        
        }).catch((err) =>  {
            console.log(err.response.data, err.response.status);
            refreshToken();
            res.redirect('/');
        });
        res.render('task2', {apiData: result});
    }catch(err){
        console.log(err.data);
        //token=undefined;
        req.flash('message', "Unable to fetch api details");
        res.redirect("/");
    }
}

export default {
    fetch
};