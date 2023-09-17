const express = require( 'express' )
const app = express()
const ejs = require( 'ejs' )
const fs = require( 'fs' )
let JsonFilePath = __dirname + '/data.json'

app.use( express.static( __dirname + '/public/' ) )
app.set( 'view engine', 'ejs' )
app.set( 'views', __dirname + '/views' )

app.get( '', ( req, res ) => {

    const data = JSON.parse( fs.readFileSync( JsonFilePath, 'utf-8' ) )
    let page = Math.floor( req.query.page ) || 1 //getting page no for pagination
    let limit = 10//limit of data to be display on frontend
    page = ( page < 0 ) ? 1 : page//this is for testers if anyone is checking my website if it entered negative numbers then page value will be 1 else it's value is correct

    let start = ( page > 1 ) ? ( page * limit ) - 9 : page //starting point of page will be 1 if page is 1 else it will be ( page * limit ) - 9 means if page is 2 then (2 * 10) - 9 that is 11
    let end = ( start == 1 ) ? 10 : start + 9//setting end of data if my starting point is 1 then it will end on 10 else it will end on start + 9 means if starting point is 11 then end point will be 20

    end = ( end > data.length ) ? data.length : end // if end is greater than dataLength then end will be equal to dataLength else it will does not change
    let NoOfPages = Math.ceil( data.length / limit )//no of pages for pagination buttons it will be dataLength divide by limit means if dataLength is 15 and limit is 10 then NoOfPages will be 2 Math.ceil is used for rouding upvalue of floating number

    if ( end <= start ) {//this condition is for any tester which is testing my website and entered value greater then the endpoint of data then it will show an error this is because i am getting page value from url means queryString

        res.json( { Error: "You are testing website" } )
        return
    }

    res.render( 'index', {
        page,
        data: data,
        pagination: {
            start, end
        }, NoOfPages
    } )
} )

app.listen( 2000 )