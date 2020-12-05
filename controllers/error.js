exports.getErrorPage = (request, response, next) => {
  {/** response.setHeader(...meta-data)..send(); - sending headers*/}

  response.render('error/not-found', { pageTitle: 'Error!', path: '/404' });
};
