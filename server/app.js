const express = require('express');
const app = express();
const cors = require('cors');
const usersController = require('./controllers/usersController.js');
const authController = require('./controllers/authController.js');
const tasksController = require('./controllers/tasksController.js');
const isAuthenticated = require('./middleware/authMiddleware.js');
const session = require('express-session');

require('dotenv').config();

app.use(cors(
    {origin: 'http://localhost:5173'}
));
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    authenticated: false,
    cookie: {secure: process.env.NODE_ENV === 'production', maxAge: 24 * 60 * 60 * 1000} // 24 hours
}))

app.get('/', (req, res) => {
    res.send('Hello World! This is the backend server.');
});

app.use(isAuthenticated)
app.use(tasksController)
app.use(usersController)
app.use(authController)

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});