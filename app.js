// import { initializeDatabase, ODDSFEED_BASE_URL, FETCH_ODDS_INTERVAL } from './config'
// import mongoose from 'mongoose'
// import { store, timestampChanged, newEdge, updateEdges, edgeDeleted, edgeChanged } from './store'
// import { xmlToJson, getInitialUrls, fetchXml } from './helpers'
// import { parseOdds } from './parsers'
// import moment from 'moment'
// import fetch from 'node-fetch'
import { computeEdges } from './computer'
// import { fetchOfferUpdates, fetchOfferChanges } from './offerupdater'
import jsonoddsapi from 'json-odds-api'

// function getInitialState() {
//   return new Promise((resolve, reject) => {
//     let timestamp
//     mongoose.model('Timestamp').getMain()
//     .then(timestamp => {
//       console.log('got timestamp', timestamp)
//       if(timestamp.timestamp === 0) {
//         timestamp = Math.floor(new Date() / 1000)
//       }
//       else {
//         timestamp = timestamp.timestamp
//       }
//       store.dispatch(timestampChanged(timestamp))
//       resolve(timestamp.timestamp)
//   }).catch(reject)
//   })
// }

// function saveData(data) {
//   return Promise.all([
//                      mongoose.model('Match').upsertBulk(data.matches),
//                      mongoose.model('Offer').upsertBulk(data.offers),
//                      mongoose.model('Timestamp').updateMain(data.timestamp)
//                      ])
// }

// function runNormal(timestamp = store.getState().timestamp) {
//   console.log(timestamp)
//   console.log('running normal')
//   let url = ODDSFEED_BASE_URL + `&last=${timestamp}`
//   let timer = new Date()
//   let matches
//   let newTimestamp
//   console.log(url)
//   fetchXml(url)
//     .then(parseOdds)
//     .then(result => {
//       matches = result.matches
//       newTimestamp = result.timestamp
//       console.log('new timestamp', newTimestamp)
//       return saveData(result)
//     }).then(() => {
//       return Promise.all([fetchOfferChanges(timestamp), fetchOfferUpdates(timestamp)])
//     }).spread((changes, updates) => {
//       return Promise.all([mongoose.model('Offer').updateOffers(changes, 'flags'),
//                          mongoose.model('Offer').updateOffers(updates, 'lastUpdated')])
//     }).spread((changes, updates) => {
//       store.dispatch(timestampChanged(newTimestamp))
//       return mongoose.model('Offer').groupOnMatches(matches)
//     }).then(computeEdges)
//     .then(edges => {
//       mongoose.model('Edge').upsertBulk(edges)
//       .then(()=> console.log('saved edges to db'))
//       timer = new Date() - timer
//       let now = new Date()
//       if (timer > FETCH_ODDS_INTERVAL) {
//         runNormal()
//       } else {
//         setTimeout(runNormal, FETCH_ODDS_INTERVAL - timer)
//       }
//     }).catch(err => {
//       console.log(err)
//       console.log('forcing a new run')
//       runNormal()
//     })
// }

// function runInitial() {
//   let allMatches = {}
//   return getInitialUrls()
//     .mapSeries((url, index, length) => {
//       let percentageDone = (index + 1) / length
//       console.log(percentageDone)
//       return Promise.delay(100).then(() => fetchXml(url))
//     }).map(parseOdds)
//     .then(results => {
//       let matches = {}
//       let offers = {}
//       let timestamp = Infinity
//       results.filter(result => result !== undefined).forEach(result => {
//         if (!!result) {
//           if (!!result.matches)
//             Object.assign(matches, result.matches)
//           if (!!result.offers)
//             Object.assign(offers, result.offers)
//           if (!!result.timestamp && result.timestamp < timestamp)
//             timestamp = result.timestamp
//         }
//       })
//       allMatches = matches
//       return saveData({ matches, offers, timestamp})
//      }).then(() => mongoose.model('Offer').groupOnMatches(allMatches))
    
// }

// function cleanUpEdges() {
//   let tenMinutesAgo = new Date(new Date() - ( 10 * 60 * 1000))
//   mongoose.model('Edge').find({})
//   .then(edges => {
//     let edgeKeys = Object.keys(edges).map(key => +key)
//     mongoose.model('Offer').update({
//       _id: {
//         $in: edgeKeys
//       },
//       lastUpdated: {
//         $lt: tenMinutesAgo
//       },
//       flags: true
//     }, {
//       $set: {
//         flags: false
//       }
//     }, {
//       multi: true
//     }).then(res => {
//       return mongoose.model('Offer').find({
//         _id: {
//           $in: edgeKeys
//         },
//         lastUpdated: {
//           $lt: tenMinutesAgo
//         }
//       }).select({_id: 1, lastUpdated: 1})
//     }).then(result => {
//       let now = new Date()
//       let updates = {}
//       for (let key in edges) {
//         let edge = edges[key]
//         if (edge.startTime <= now) {
//           updates[key] = null
//         }
//       }
//       result.forEach(offer => {
//         updates[offer._id] = null
//       })

      
//     }).catch(console.log)
//     .finally(() => setTimeout(cleanUpEdges, 10000))
//   })
  
// }


function start() {
  // initializeDatabase()
  //   .then(getInitialState)
  //   .then(timestamp=> {
  //     return runNormal()
  //   })
  //   .catch(err=> err)
  let apikey = '0866d8b9-fc55-4a22-9f05-75db1d03ea91'
  let jsonOdds = new jsonoddsapi(apikey)
  jsonOdds.getOdds({source:0},(err, response, body)=> {
    Object.keys(body).map(k => {
      let americanOdds = body[k].odds
      console.log(body[k])
    })
  })
}

start()

