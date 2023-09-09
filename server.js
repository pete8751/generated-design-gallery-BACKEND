import express, { response } from 'express'
import bodyParser from 'body-parser'
import knex from 'knex'
import cors from 'cors'

const app = express();

app.use(bodyParser.json());
app.use(cors())
//THIS VARIABLE IS ENVIRONMENTAL, IT IS INITIALIZED IN BASH.
const PORT = process.env.PORT || 3000;
const HOSTNAME = 'dpg-cjtprj95mpss739vapu0-a.oregon-postgres.render.com';
const USER = 'onlinegenerateddesigndatabase_user';
const PASSWORD = '6ZOo0XsuTB3nvcCAdNr8XL11a4Pi4Hos';
const DATABASE_NAME = 'onlinegenerateddesigndatabase';

const db = knex({
    client: 'pg',
    connection: {
      host : HOSTNAME, //this is the ip of the localhost
      port : 5432,
      user : USER,
      password : PASSWORD,
      database : DATABASE_NAME
    }
  });



// const db = knex({
//     client: 'pg',
//     connection: {
//       host : process.env.HOSTNAME || '127.0.0.1', //this is the ip of the localhost
//       port : 5432,
//       user : process.env.USER || 'postgres',
//       password : process.env.PASSWORD || 'test',
//       database : process.env.DATABASE_NAME|| 'galleryproj'
//     }
//   });

// console.log(process.env.HOSTNAME)
// console.log(process.env.USER)
// console.log(process.env.PASSWORD)
// console.log(process.env.DATABASE_NAME)

//   postgresql://onlinegenerateddesigndatabase_user:6ZOo0XsuTB3nvcCAdNr8XL11a4Pi4hOS@dpg-cjtprj95mpss739vapu0-a.oregon-postgres.render.com/onlinegenerateddesigndatabase

const defaultObj = {
    Height: ['0', '100'],
    Price: ['0', '100000'],
    Search: "",
    Style: [],
    Width: ['0', '100'],
    isBundle: false,
    sortBy: "none"
}

app.get('/', (req, res) => {
    dbFilter(defaultObj.Price, defaultObj.Height, defaultObj.Width, defaultObj.Style, defaultObj.isBundle, defaultObj.Search, defaultObj.sortBy).then(result => {res.json(result)})
})

app.post('/', (req, res) => {
    const body = req.body;
    dbFilter(body.Price, body.Height, body.Width, body.Style, body.isBundle, body.Search, body.sortBy).then(result => {res.json(result)})
})

app.post('/cart', (req, res) => {
    const cart = req.body.carted
    console.log(typeof(cart[0]))
    if (cart.length > 1){
        getImages(cart)
        .then(result => {res.json(result)})
    } else {
        db.select('*').from('img').where('imgid', cart[0]).then(result => {res.json(result)})
    }
})


app.post('/likes', (req, res) => {
    const likes = req.body.likes
    if (likes.length > 1){
        getImages(likes)
        .then(result => {res.json(result)})
    } else {
        db.select('*').from('img').where('imgid', likes[0]).then(result => {res.json(result)})
    }
})

function getImages(array){
    let queryArray = array.map(element => 
        {return db.select('*').from('img').where('imgid', element)})

    return db.select('*').from('img').where('imgid', array[0]).union(queryArray)
}


app.post('/Product%20Closeup/Item.html', (req, res) => {
    const imgid = req.body.imgid

    db.select('*').from('img').where('imgid', imgid)
    .then(result => {
        if (result[0].isbundle) {
            db.select('*').from('img').where('bundleid', result[0].bundleid)
            .then(result1 => {res.json(result1)})
        } else {
            res.json(result[0])
        }
    })
})

// const testObj = {
//     Price: [0, 100000],
//     Height: [0, 12],
//     Width: [0, 12],
//     Style: ["%Modern%"],
//     isBundle: false,
//     Search: "",
//     sortBy: "lowestprice"
// }


app.listen(PORT || 3000, () =>{
    console.log(`app is running on port ${PORT}`);
})


async function dbFilter(Price, Height, Width, Style, isBundle, Search, sortBy) {
    if (sortBy == "none"){
        return db.select('*').from('img').where('price','>', Price[0]).andWhere('price','<', Price[1]).intersect([
            heightFilter(db, Height), widthFilter(db, Width), styleFilter(db, Style), bundleFilter(db, isBundle), dbSearch(db, Search)])
    } else {
        return db.select('*').from('img').where('price','>', Price[0]).andWhere('price','<', Price[1]).intersect([
            heightFilter(db, Height), widthFilter(db, Width), styleFilter(db, Style), bundleFilter(db, isBundle), dbSearch(db, Search)]).orderBy('price', sortValue(sortBy))          
    }
}



function sortValue(value) {
    if (value == "highestprice"){
        return "desc"
    } else {
        return "asc"
    }
}

function heightFilter(db, Height) {
    return db.select('*').from('img').where('height','>', Height[0]).andWhere('height','<', Height[1])   
}

function widthFilter(db, Width) {
    return db.select('*').from('img').where('width','>', Width[0]).andWhere('width','<', Width[1])   
}

function styleFilter(db, Style) {
    const base = db.select('*').from('img')
    const Styles = Style.map(element => {
        return db.select('*').from('img').whereILike('style', element);
    })
    if (Style == []) {
        return base
    } else {
        return base.intersect(Styles)
    }
}

function bundleFilter(db, isBundle) {
    if (isBundle){
        return db.select('*').from('img').where('isbundle', 'true')
    } else {
        return db.select('*').from('img')
    }
}

function dbSearch(db, search){
    if (search == "") {
        return db.select('*').from('img');
    } else {
        return db.select('*').from('img').whereILike('img_name', `%${search}%`);  
    }
}



