import User from "../model/user.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({id}, 'jwt', {
        expiresIn: maxAge
    });
};

export const createAccount = async (req, res) => {
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(req.body.password, salt);
    const user = new User({
        email: req.body.email, username: req.body.username, password: hashPassword
    })
    user.save()
        .then(() => {
            const token = createToken(user._id);

            res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000});
            res.header('jwt', token)
            res.status(201).json({
                user: user, token: token
            });
        })
        .catch((err) => {
            res.status(400).json({error: err.message});
        })
}

export const login = async (req, res) => {
    const {username, email, password} = req.body;
    try {
        const user = await User.findOne({$or: [{email: email}, {username: username}]});
        if (user) {
            const auth = await bcrypt.compare(password, user.password);
            if (auth) {
                const token = createToken(user._id);
                res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000}); 
                res.header("jwt", token)
                res.status(200).json({
                    token, ...user._doc
                });
            } else {
                res.status(400).json({error: "Incorrect password"})
            }
        } else {
            res.status(404).json({error: "No user found"})
        }
    } catch (err) {
        res.status(400).json({error: err.message})
    }
}

export const logout = async (req, res) => {
    res.cookie('jwt', '', {maxAge: 1});
    res.header('jwt', '')
    res.status(200).send({"msg": "logged out"});
}

export const getUserData = async (req, res) => {
    try {
      const user = req.user;
      if (user) {
        const newToken = refreshToken(req, res);
        res.status(200).json({ token: newToken, ...user._doc });
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
  

  const refreshToken = (req, res) => {
    try {
      const user = req.user;
      const newToken = createToken(user._id);
      
      // Set the new token in the response header
      res.set('jwt', `${newToken}`);
      
      // Return the new token
      return newToken;
    } catch (error) {
      throw new Error('Failed to refresh token');
    }
  };
  

 
  
  


