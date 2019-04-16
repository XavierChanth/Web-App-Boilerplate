// multi-threaded
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

// setup express
const express = require('express');
const app = express();

// basic security
const helmet = require('helmet');
app.use(helmet);

// compress with gzip
const gzip = require('compression');
app.use(gzip());

// encoding
const bp = require('body-parser');
app.use(bp.json());

// logging
const logger = require('morgan');
app.use(logger('short'));

// set static view
const __dir = __dirname + '/client/build';
app.use(express.static(__dir));
app.set('views', __dir);

// set view engine
const ejs = require('ejs').renderFile;
app.engine('html', ejs);
app.set('view engine', 'html');

// event control
const events = require('events');
events.EventEmitter.defaultMaxListeners = 0; // no cap

// express routing
const router = express.Router();

if(cluster.isMaster) {
  console.log(`Start: MASTER ${process.pid}`);

  //Fork workers
  for(let i = 0; i < numCPUs; i++){
    cluster.fork();
  }
  cluster.on('exit', (worker) => {
    console.log(`Killed: WORKER ${worker.process.pid}`);
  });
} else {
  // '/api' route
  router.options('/', (req, res) => {
    // Handle options request to api HERE
  });

  router.post('/', (req, res) => {
    // Handle post request to api HERE
  });

  router.get('/', (req, res) => {
    // Handle get request to api HERE
  });

  app.use('/api', router);


  // '/' route

  // index page
  app.get('/', (req, res) => {
    res.render('index');
  });

  // 404
  app.get('*', (req, res) => {
    res.sendStatus(404);
  });
  
  // listen on port
  const PORT = 80;
  app.listen(PORT, () => {
    console.log(`start: CLUSTER ${process.pid}`);
  });
}