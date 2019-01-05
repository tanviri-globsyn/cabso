var express = require('express'),
path = require('path'),
bodyParser = require('body-parser'),
cors = require('cors'),
http = require('http'),
mongoose = require('mongoose'),
passport = require('passport'),
admin = require('./server/routes/user'),
config = require('./server/database'),
multer = require('multer'),
pageRoutes = require('./server/routes/helpPage'),
bannerRoutes = require('./server/routes/bannerRoutes'),
homeRoutes = require('./server/routes/homeRoutes'),
faqRoutes = require('./server/routes/faqRoutes'),
nodeMailer = require('nodemailer'),
bodytypes = require('./server/routes/bodytypeRoutes'),
amenities = require('./server/routes/amenitiesRoutes'),
category = require('./server/routes/categoryRoutes'),
driver = require('./server/routes/driverRoutes'),
tax = require('./server/routes/commissionsRoutes'),
user = require('./server/routes/usermanagementRoutes'),
payment = require('./server/routes/paymentRoutes'),
vehicle = require('./server/routes/vehicleManagement'),
rides = require('./server/routes/ridesManagement'),
settlement = require('./server/routes/settlementRoutes');


var api = require('./server/apiroutes/api');
var driverapi = require('./server/apiroutes/driverapi');
var chat= require('./server/apiroutes/chat');
var logger = require('morgan');



const app = express();
app.use(bodyParser.urlencoded({ 'extended': 'true' }));
app.use(bodyParser.json());
app.use(cors());
const port = process.env.PORT || 3000;

app.use(cors());
app.use(passport.initialize());
// app.use(logger('dev')); /* View logs */
app.use(passport.session());

require('./server/passport')(passport);
app.use('/admin', admin);
app.use('/page', pageRoutes);
app.use('/home',homeRoutes);
app.use('/banner',bannerRoutes);
app.use('/faqroutes',faqRoutes);
app.use('/bodytype',bodytypes);
app.use('/amenities',amenities);
app.use('/category',category);
app.use('/user',user);
app.use('/driverRoutes',driver);
app.use('/vehicleRoutes',vehicle);
app.use('/rides',rides);
app.use('/gallery', express.static(__dirname + '/src/assets/media'));
app.use('/imagegallery', express.static(__dirname + '/src/assets/uploads'));
app.use('/api', api);
app.use('/driverapi', driverapi);
app.use('/chat', chat);
app.use('/tax',tax);
app.use('/payment',payment);
app.use('/settlement',settlement);
app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static(__dirname + '/src'));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});




mongoose.Promise = global.Promise;
mongoose.connect(config.database).then(
  () => {console.log('Database is connected') },
  err => { console.log('Can not connect to the database'+ err)}
  );


// error handler
app.use(function (err, req, res, next) {
// set locals, only providing error in development
res.locals.message = err.message;
res.locals.error = req.app.get('env') === 'development' ? err : {};
// render the error page
res.status(err.status || 500);
res.render('error');
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
const server = http.createServer(app);
server.listen(port, () => console.log(`API running on localhost:${port}`));