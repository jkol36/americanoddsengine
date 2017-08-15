import mongoose from 'mongoose'

const edgeSchema = mongoose.Schema({
  _id: Number,
  edge: Number,
  odds: Number,
  bookmaker: {
    name: String,
    _id: Number
  },
  oddsType: Number,
  matchId: Number,
  homeTeam: {
    name: String,
    _id: Number
  },
  awayTeam: {
    name: String,
    _id: Number
  },
  startTime: Date,
  competition: {
    _id: Number,
    name:String
  },
  sportId: Number,
  country: String,
  output: Number,
  oddsTypeCondition: Number,
  baseline: Number,
  createdAt: Date,
  Kelly: Number,
  wager: Number,
  status: Number

})

edgeSchema.statics.upsertBulk = function(edges) {
  if (Object.keys(edges).length === 0) {
    return Promise.resolve({})
  }
  let bulk = this.collection.initializeOrderedBulkOp()
  for (let key in edges) {
    let edge = edges[key]
    bulk.find({_id: edge._id}).upsert().update({
      '$set': {
        startTime: edge.startTime,
      },
      '$setOnInsert': {
        _id: edge._id,
        homeTeam: edge.homeTeam,
        awayTeam: edge.awayTeam,
        competition: edge.competition,
        sportId: edge.sportId,
        country: edge.country,
        edge: edge.edge,
        odds: edge.odds,
        bookmaker: edge.bookmaker,
        oddsType: edge.oddsType,
        matchId: edge.matchId,
        output: edge.output,
        oddsTypeCondition: edge.oddsTypeCondition,
        baseline: edge.baseline,
        createdAt: edge.createdAt,
        kelly: edge.kelly,
        wager: edge.wager,
        status: edge.status
      }
    })
  }
  return bulk.execute()
}

export default mongoose.model('Edge', edgeSchema)
