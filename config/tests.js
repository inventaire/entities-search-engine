module.exports = {
  port: 3214,
  elastic: {
    indexes: {
      inventaire: 'entities-tests'
    }
  },
  inventaire: {
    host: 'http://localhost:3009'
  }
}
