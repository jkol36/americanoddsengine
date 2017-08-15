import Promise from 'bluebird'
global.Promise = Promise

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load()
}

import mongoose from 'mongoose'
mongoose.Promise = Promise

require('../models')

// import Firebase from 'firebase'

// export const firebaseRef = new Firebase('')
// export const statusRef = new Firebase('')

export function initializeDatabase() {
  return mongoose.connect(process.env.DATABASE_URL)
}

export const ODDSFEED_BASE_URL = `http://xml2.txodds.com/feed/odds/xml.php?ident=gjelstabet&passwd=8678y7u7&live=0&spid=${process.env.SPORTS}&bid=${process.env.BOOKMAKERS}&ot=${process.env.ODDS_TYPES}&days=0,${process.env.DAYS_AHEAD}&all_odds=2`
export const FETCH_ODDS_INTERVAL = 10000
