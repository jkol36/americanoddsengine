import { firebaseRef } from '../config'
import fetch from 'node-fetch'
import { expect } from 'chai'
import request from 'superagent'

// describe('Oddsengine', () => {
//   it('Should match against old engine', done => {
//     firebaseRef.once('value', snap => {
//       let edges = {}
//       snap.forEach(edge => {
//         edges[edge.val().offer] = edge.val()
//       })
//       request
//         .get('https://www.edgebet.net/api/edges/?bookmakerList=4236&lowRisk=0&reqLeagues=0')
//         .auth('martin@edgebet.net', 'martinroed')
//         .end((err, res) => {
//           let counter = 0
//           let now = new Date()
//           res.body.forEach(edge => {
//             if (new Date(edge.o2.offer.match.start_time) - new Date() > 1000 * 60 * 60 * 12)
//               return
//             if (!edges[edge.o2.offer.id]) {
//               console.log(edges[edge.o2.offer.id])
//               counter += 1
//               console.log('Missing edge', edge.o2.offer.id, edge.o2.offer.bookmaker.name, edge.o2.offer.match.hteam.name, edge.o2.offer.match.ateam.name, edge.o2.offer.odds_type, edge.o2.o1, edge.o2.o2, edge.o2.o3, edge.output)
//             }
//           })
//           console.log(counter)
//           done()
//         })
//     })
//   })
// })
