function isUserLoggedIn(req, res, next) {
  const {
    session: { user },
  } = req;
  if (user) {
    next();
  } else {
    res.status(401);
    res.json({ error: 'user is not logged in' });
  }
}

export { isUserLoggedIn };
