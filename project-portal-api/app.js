const express = require('express');
const router = express.Router();
//const md5 = require('md5');
const jwt = require('jsonwebtoken');
const mysql = require ('mysql');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/api', (req, res) => {
    res.json({
        message: 'Welcome to the API'
    });
});

app.post('/api/posts', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if(err) {
            res.sendStatus(403);
        }
        else {
            res.json({
                message: 'Post created...',
                authData
            });
        }
    });
});

app.post('/api/login', (req, res) => {
    // Mock user
    const user = {
        id: 1,
        username: 'john',
        email: 'john@gmail.com'
    }

    jwt.sign({user}, 'secretkey', { expiresIn: '30s' }, (err, token) => {
        res.json({
            token
        });
    });
});

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "nonprofitapp_data"
});

app.post('/login', async function (req, res, next) {
    try {
        let {email, password} = req.body;

 //       const hashed_password = md5(password.toString())

        const sql = 'SELECT * FROM user WHERE email = ? AND password = ?'

        con.query(
            sql, [email, password],
            function (err, result, fields) {
                if (err) {
                    res.send({status: 0, data: err});
                }
                else{
                    let token = jwt.sign({ data: result }, 'secret')
                    res.send({status: 1, data: result, token: token});
                }
            }
        )
    }
    catch (error) {
        res.send({status: 0, error: error });
    }
});

// FORMAT OF TOKEN
// Authorization: Bearer <access_token>

// Verify Token
function verifyToken(req, res, next) {
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if(typeof bearerHeader !== 'undefined') {
        // Split at the space
        const bearer = bearerHeader.split(' ');
        //get token from array
        const bearerToken = bearer[1];
        // Set the token
        req.token = bearerToken;
        // Next middleware
        next();

    } else {
        // Forbidden
        res.sendStatus(403);
    }
}

app.listen(5000, () => console.log('Server started on port 5000'));