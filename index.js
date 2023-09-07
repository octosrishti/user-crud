const express = require('express');
const {PORT} = require('./constants')
const db = require('./config/db')
const app = express();
const { User } = require('./models/user')

const cors = require('cors');
const createError = require('http-errors');
const { verifyAuthToken } = require('./services/token_service');
const { handleInvalidJson, handleUnauthorized, handleNotFound, handleAllOtherErrors } = require('./services/error_service');

const corsOptions = {
    exposedHeaders: 'Authorization',
  };
  
  app.use(cors(corsOptions));
  app.use(express.json({ limit: '100mb' }));

// Application check Route
app.route('/').get((req, res) => {
  res.status(200).send('Application working !');
});

// Token verification middleware
app.all('/api/*', (req, res, next) => {
  const pathUrl = req.path.split('/api/')[1].split('/')[0];
  const pathUrlEnding = req.path.split('/v1/')[1].split('/').pop();
  console.log('pathUrl', pathUrl);
  console.log('pathUrlEnding', pathUrlEnding);
  const publicRoutes = ['auth', 'master'];
  const restrictedRoutes = ['update', 'get_all', 'get_single', 'delete'];
  if (
    req &&
    publicRoutes.includes(pathUrl.toLowerCase()) &&
    !restrictedRoutes.includes(pathUrlEnding.toLowerCase())
  ) {
    return next();
  } else {
    return verifyAuthToken(req, res, next);
  }
});

// Import routes

const authRoute = require('./src/routes/auth.routes');

// Route middleware

app.use('/api', authRoute);

// Global Route (To be put after all route declarations, otherwise is always called with every API request)
app.use(async (req, res, next) => {
  next(createError.NotFound('Resource not found'));
});

// Route for handling errors
// eslint-disable-next-line no-unused-vars
app.use(handleUnauthorized);
app.use(handleInvalidJson);
app.use(handleNotFound);
app.use(handleAllOtherErrors);

app.listen(PORT,async ()=>{    
    await db.authenticate();
    User.sync({force:true})
    console.log(`starting conversation bot server on port ${PORT}`)
})
.on('close', ()=>{
    sequelize.close()
})