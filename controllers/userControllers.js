import {
  createNewUser,
  findUser,
  updateUser,
  findUserByToken,
} from '../services/userService.js';
import { configDotenv } from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
configDotenv();

export const signupUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(500)
      .json({ error: 'Username and password are required.' });
  }

  const duplicate = await findUser(email);
  if (duplicate && duplicate.length > 0) {
    return res.status(500).json({ error: 'User already exists.' });
  }

  try {
    //encrypt the password
    const hashedPwd = await bcrypt.hash(password, 10);
    //store the new user
    const newUser = { email: email, password: hashedPwd };
    const response = await createNewUser(newUser);
    res.status(201).json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const foundUser = await findUser(email);

  if (!foundUser || (foundUser && foundUser.length === 0)) {
    res.status(404).json({ error: 'User not found' });
  }

  const match = await bcrypt.compare(password, foundUser[0].password);

  if (match) {
    const accessToken = jwt.sign(
      { email: foundUser[0].email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '30d' }
    );
    const refreshToken = jwt.sign(
      { email: foundUser[0].email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '30d' }
    );

    const updateData = await updateUser({
      ...foundUser[0],
      token: refreshToken,
    });

    if (!updateData || (updateData && updateData.length === 0)) {
      res.status(500).json({ error: 'Update error' });
    }

    res.cookie('jwt', refreshToken, {
      httpOnly: false,
      sameSite: 'None',
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ accessToken });
  } else {
    res.status(500).json({ error: 'Username or password incorrect' });
  }
};

export const logoutUser = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  const token = cookies.jwt;

  // Is token in db?
  const foundUser = await findUserByToken(token);
  if (!foundUser || (foundUser && foundUser.length === 0)) {
    res.clearCookie('jwt', { httpOnly: false, sameSite: 'None', secure: true });
    return res.sendStatus(204);
  }

  const currentUser = { ...foundUser, token: null };
  await updateUser(currentUser);

  res.clearCookie('jwt', { httpOnly: false, sameSite: 'None', secure: true });
  res.sendStatus(204);
};

// async function signup () { for frontend only
//   const data = { email: '', password: '' };
//   try {
//     const url = '/users/signup';
//     const res = await api(url, 'POST', data);
//     console.log('STA JE RESUL::::', res);
//     return res;
//   } catch (error) {
//     return error;
//   }
// }