const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // const token = req.headers.authorization;

    // if (!token) {
    //   return res.status(401).send('Access denied. No token provided.');
    // }

    const { user_type } = req.body; 
    // Another solve
    // if (req.session && req.session.loggedIn) {
    // } else {
    //     res.status(401).send('Access denied. Please log in.');
    //   }

    // try {
    //     const decoded = jwt.verify(token, 'your_secret_key');
    //     req.user = decoded;

        if (user_type === 'teacher') {
        next();
        } else if (user_type === 'student') {
        res.status(403).send('Access restricted to students');
        } else {
        res.status(400).send('Invalid user type');
        }
    // } catch (error) {
    //     res.status(401).send('Invalid token.');
    // }
  };
  
  module.exports = authMiddleware;
  