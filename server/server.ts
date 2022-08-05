import express from 'express';

const app = express();

app.use((req, res, next) =>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE');

    if('OPTIONS' == req.method){
        res.sendStatus(200);
    } else {
        console.log(`${req.ip} ${req.method} ${req.url}`);
        next();
    }
});

app.get('/getData', (req, res) =>{
    res.send([{sender: 'John Doe', subject: 'Your extended warranty', description: 'Wahoo'}]);
});

app.listen(4201, '127.0.0.1', function(){
    console.log('Server is listening on 4201');
});