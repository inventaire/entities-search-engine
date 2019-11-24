module.exports = {
  inventaire: {
    // Using inventaire-alt instance wasn't such a good idea
    // as it 500 when the server is down.
    // Using inventaire.io allows to let Nginx handle the fallback
    host: 'https://inventaire.io'
  }
}
