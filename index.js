// REQUIRED MODULES_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
const express = require( 'express' ),
    path = require( 'path' ),
    morgan = require( 'morgan' ),
    bodyParser = require( 'body-parser' ),
    cookieSession = require( 'cookie-session' ),
    // session = require( 'express-session' ),
    compression = require( 'compression' );
    // favicon = require( 'serve-favicon' );

// EXPRESS
const app = express();

// MIDDLEWARE __________________________________________________________________

// HTTP request logger middleware
app.use( morgan( 'dev' ) );
// _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

// compression gZip response before sending them
app.use( compression() );
// _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

// BODY PARSER
app.use( bodyParser.json() );
// _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

// COOKIE SESSION
app.use( cookieSession( {
    secret: require( './config/secrets.json' ).sessionSecret,
    maxAge: 1000 * 60 * 60 * 24 * 14
} ) );
// _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _


if ( process.env.NODE_ENV != 'production' ) {
    app.use( require( './build' ) );
}

// set the public folder where client stuff lives
// app.use( express.static( './public' ) );
app.use( express.static( path.join( __dirname, '/public' ) ) );



// ROUTING _____________________________________________________________________
//  Connect all our routes to our application
app.use( '/', require( './routes/root' ) );
app.use( '/api/', require( './routes/api' ) );

// if no route match then..
app.get( '*', function ( req, res ) {
    res.send( 'nothing found' );
} );
// _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _


// ERROR:
// catch 404 and forward to error handler
app.use( function ( req, res, next ) {
    var err = new Error( 'Not Found' );
    err.status = 404;
    next( err );
} );

app.use( ( err, req, res, next ) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get( 'env' ) === 'development' ? err : {};

    // render the error page
    res.status( err.status || 500 );
    res.send( 'error' );
} );
// _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _


// SERVER ______________________________________________________________________
const listener = app.listen( process.env.PORT || 8080, () => {
    console.log( `listening on port ${listener.address().port}.` );
} );