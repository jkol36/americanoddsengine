import mongoose from 'mongoose'

export const Odds = mongoose.Schema({
  o1: {
    type: Number
  },
  o2: {
    type: Number
  },
  o3: {
    type: Number
  },
  o4: {
    type: Number
  },
  time: {
    type: Date
  }
})

const offerSchema = mongoose.Schema({
  _id: {
    type: Number
  },
  oddsType: {
    type: Number
  },
  bookmaker: {
    _id: Number,
    name: String
  },
  lastUpdated: {
    type: Date,
    index: true
  },
  flags: {
    type: Boolean,
    index: true
  },
  bmoid: {
    type: String
  },
  match: {
    type: Number,
    ref: 'Match',
    index: true
  },
  odds: [Odds]
})

offerSchema.statics.upsertBulk = function(offers) {
  if (Object.keys(offers).length === 0)
    return Promise.resolve()
  let bulk = this.collection.initializeUnorderedBulkOp()
  for (let key in offers) {
    let offer = offers[key]
    bulk.find({_id: offer._id}).upsert().update({
      '$set': {
        lastUpdated: offer.lastUpdated,
        flags: offer.flags
      },
      '$setOnInsert': {
        _id: offer._id,
        oddsType: offer.oddsType,
        match: offer.match,
        bookmaker: offer.bookmaker
      },
      '$push': {
        odds: offer.odds
      }
    })
  }
  return bulk.execute()
}

offerSchema.statics.groupOnMatches = function(matches) {
  return new Promise((resolve, reject) => {
    let cursor = this.aggregate()
      .match({
        match: {
          $in: Object.keys(matches).map(key => +key)
        },
        flags: true,
        lastUpdated: {
          $gt: new Date(new Date().getTime() - (10 * 60 * 1000))
        }
      })
      .group({
        _id: '$match',
        offers: {
          $push: {
            _id: '$_id',
            oddsType: '$oddsType',
            bookmaker: '$bookmaker',
            odds: '$odds'
          }
        }
      })
      .allowDiskUse(true)
      .cursor({batchSize: 20})
      .exec()
    cursor.get().then(groups => {
      for (let group of groups) {
        group.offers = group.offers.map(offer => {
          offer.odds = offer.odds[offer.odds.length - 1]
          return offer
        })
        group.match = matches[group._id]
      }
      resolve(groups)
    }).catch(reject)
  })
}

offerSchema.statics.updateOffers = function(data, prop) {
  if (Object.keys(data).length === 0)
    return Promise.resolve({nModified: 0})
  let bulk = this.collection.initializeUnorderedBulkOp()
  for (let key in data) {
    bulk.find({_id: +key}).update({
      $set: {
        [prop]: data[key]
      }
    })
  }
  return bulk.execute()
}

export default mongoose.model('Offer', offerSchema)
