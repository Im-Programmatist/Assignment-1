//To call and get data from APIs
import axios from 'axios';

async function fetch(req, res, next) {
    
    try{
        var result = {};
        var token = req.params.token || process.env.BHRESTTOKEN;
        var url = 'https://rest99.bullhornstaffing.com/rest-services/70lqp0/query/ClientCorporationCustomObjectInstance5?fields=id,text11,textBlock5,textBlock3,text9,text3,text4&where=text11%20IS%20NOT%20NULL%20AND%20clientCorporation.id%20=%20318253&BhRestToken='+token;
        await axios.get(url)
        .then((res) => {
            result.length = res.data.data.length;  
            result.data = res.data.data;        
        }).catch((err) =>  {
            console.log(err.response.data, err.response.status);
        });
        res.render('assignment', {apiData: result});
    }catch(err){
        console.log(err);
        //token=undefined;
        req.flash('message', "Unable to fetch api details");
        res.redirect("/index");
    }
}

export default {
    fetch
};