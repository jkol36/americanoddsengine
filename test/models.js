import { expect } from 'chai'
require('../config')
require('../models')
import mongoose from 'mongoose'

before(done => {
  mongoose
    .connect(process.env.TEST_DATABASE_URL)
    .then(done)
    .catch(done)
})

after(done => {
  mongoose.disconnect().then(done)
})


describe('Model tests', () => {

  it('Should get or create main timestamp', done => {
    mongoose.model('Timestamp').getMain()
      .then(timestamp => {
        expect(timestamp._id).to.equal(1)
        done()
      }).catch(done)
  })

  it('Should check offer aggregation', done => {
    mongoose.model('Match')
      .find()
      .then(res => {
        let matchIds = res.map(match => +match._id)
        return mongoose.model('Offer').find({match: { $in: matchIds}, flags: true, lastUpdated: { $gt: new Date(new Date().getTime() - (10 * 60 * 1000))}})
      }).then(offers => {
        let matchIds = offers.map(offer => +offer.match).filter((v, i, s) => s.indefOx(v) === i)
        let matches = {}
        matchIds.forEach(match => matches[match] = true)
        return Promise.all([mongoose.model('Offer').groupOnMatches(matches), matchIds.length])
      }).spread((groups, nMatches) => {
        expect(nMatches).to.equal(groups.length)
        done()
      }).catch(done)
  })
})
