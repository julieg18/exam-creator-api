import User from '../../models/User';

async function isUserIdValid(userId) {
  let isIdValid = false;
  try {
    const userCount = await User.countDocuments({ _id: userId });
    isIdValid = userCount === 1;
  } catch (err) {
    isIdValid = false;
  }
  return isIdValid;
}

async function doesEmailExist(email) {
  let doesEmailExistInDatabase = false;
  try {
    const userCount = await User.countDocuments({ email });
    doesEmailExistInDatabase = userCount === 1;
  } catch (err) {
    doesEmailExistInDatabase = false;
  }
  return doesEmailExistInDatabase;
}

export { isUserIdValid, doesEmailExist };
