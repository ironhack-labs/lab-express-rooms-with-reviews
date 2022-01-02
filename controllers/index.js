function getHome(req, res) {
  console.log('getHome');
  res.render('index');
}

function getPrivate(req, res) {
  console.log('session', req.session);
  res.render('private');
}

module.exports = { getHome, getPrivate };
