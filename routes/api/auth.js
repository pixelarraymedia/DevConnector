const express = require ('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require ('../../middleware/auth');
const config = require('config');
const jwt = require('jsonwebtoken');

const { check, validationResult } = require('express-validator');
const User = require('../../models/User');

// @route Get api/auth
// @desc test route
// @access Public

router.get ('/' , auth, async (req, res) => {
      try 
    {
        const user= await User.findById(req.user.id).select('-password');
        res.json(user);
        }
catch(err){
    console.error(err.message);
    res.status(500).send('Server Error');

}   
});


// @route post api/auth
// @des authenticate user and get token
// @access Public

router.post ('/' , [ 
check('email','please include a valid email').isEmail(),
check('password','password is required').exists()


], 

async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array() });
  }

  const { email, password} = req.body;
try {
 let user = await User.findOne({ email });
// checking to see if there is NOT a user
 if (!user){ 
           return res.status(400).json({ errors: [{ msg: 'Invalid credentials'}] });

 }
const isMatch = await bcrypt.compare(password, user.password);

if(!isMatch)
{

    return res.status(400).json({ errors: [{ msg: 'Invalid credentials'}] });
}


    const payload = {
        user: {
            id: user.id
        }
    };

jwt.sign(payload,
    config.get( 'jwtSecret'),
    {expiresIn:360000},
    (err, token) => { if (err) throw err; 
    res.json ({ token });

} );


// res.send ('User registered');

} catch(err) {
 console.error(err.message);
 res.status(500).send('Server error');
 
}


});

module.exports = router;