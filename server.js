

var express =           require('express')
    , http =            require('http')
    , passport =        require('passport')
    , path =            require('path')
    , morgan =          require('morgan')
    , bodyParser =      require('body-parser')
    , methodOverride =  require('method-override')
    , cookieParser =    require('cookie-parser')
    , cookieSession =   require('cookie-session')
    , session =         require('express-session')
    , csrf =            require('csurf')
    , cors =            require('cors')
    , flash =           require('flash')
    , mongoose =        require('mongoose')
    , User =            require('./server/models/User.js')
    , config =          require('./config')
    , ApartmateUser =   require('./server/models/ApartmateUser.js');
// var seojs = require('express-seojs');


// Configure access control allow origin header stuff
var ACCESS_CONTROLL_ALLOW_ORIGIN = true;

require('express-namespace');

passport.use(User.localStrategy);
//passport.use(User.twitterStrategy());   
passport.use(User.facebookStrategy()); 
passport.use(User.linkedInStrategy()); 

passport.serializeUser(User.serializeUser);
passport.deserializeUser(User.deserializeUser);

var app = module.exports = express();


app.set('views', __dirname + '/client/views');
app.set('/components', __dirname + '/client/components');
app.set('/fonts', __dirname + '/client/fonts');

app.set('view engine', 'jade');
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(cors());
app.use(cookieParser());

app.use(session({ secret: 'keyboard cat' }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'client')));

 //Uncomment this line if you don't want to enable login via Facebook
//passport.use(User.googleStrategy());    Uncomment this line if you don't want to enable login via Google
// Uncomment this line if you don't want to enable login via LinkedIn



// app.use(function(req, res, next) {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type,X-Requested-With');
//   res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,HEAD,DELETE,OPTIONS');
//   res.setHeader('Access-Control-Allow-Credentials', true);

//   if ('OPTIONS' == req.method) {
//     res.send(200);
//   } else {
//     next();
//   }

//  });

if (app.get('env') === 'development') {
  app.locals.pretty = true;
}

console.log(process.env.NODE_ENV);
console.log(process.env.PORT);

var env = process.env.NODE_ENV || 'development';
if ('development' === env || 'production' === env) {
    //app.use(csrf());
    app.use(require('prerender-node').set('prerenderToken', '4Y98qpBDTXiRPQ1BpGgW'));

    // app.use(seojs('bi9bw4cdmq9pyfwpt5adz1csd'));

    app.use(function(req, res, next) {
        //res.cookie('XSRF-TOKEN', req.csrfToken());
        next();
    });
}





require('./server/routes.js')(app);
require('./server/apps/properties')(app);
require('./server/apps/profile')(app);

if(process.env.IS_DEV == "dev"){
    var db = mongoose.connect(config.development.dbUrl);
    console.log("connected to: " + config.development.dbUrl);
} else {
    var db = mongoose.connect(config.production.dbUrl);
    console.log("connected to: " + config.production.dbUrl);
}

app.set('port', process.env.PORT);
http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});
