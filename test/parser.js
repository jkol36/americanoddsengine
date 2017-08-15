// import { expect } from 'chai'
// import mongoose from 'mongoose'
// import { parseOdds } from '../parsers'
// import fs from 'fs'
// import path from 'path'
// import { xmlToJson } from '../helpers'
// import fetch from 'node-fetch'
// import { computeEdges } from '../computer'

// describe('Oddsparser', () => {
//   it('Should parse test odds', done => {
//     const buffer = fs.readFileSync(path.join(__dirname, 'randomsample.xml'))
//     xmlToJson(buffer)
//       .then(parseOdds)
//       .then(result => {
//         return Promise.all([mongoose.model('Match').upsertBulk(result.matches),
//                            mongoose.model('Offer').upsertBulk(result.offers),
//                            Promise.resolve(result.matches)])
//       }).spread((matchResult, offerResult, matches) => {
//         Object.keys(matches).map(k => matches[k]).forEach(match => {
//           expect(match.country).to.be.ok
//         })
//         expect(matchResult.ok).to.be.ok
//         expect(matchResult.nMatched + matchResult.nUpserted + matchResult.nModified).to.equal(272)
//         expect(offerResult.ok).to.be.ok
//         expect(offerResult.nModified + offerResult.nUpserted + offerResult.nMatched).to.equal(17060)
//         return mongoose.model('Offer').groupOnMatches(matches)
//       }).then(groups => {
//         expect(groups.length).to.equal(0)
//         let edges = computeEdges(groups)
//         expect(Object.keys(edges).length).to.equal(0) // Everything should be too old
//         done()
//       }).catch(done)
//   })

//   // it('Should parse odds xml feed', done => {
//   //   fetch('http://xml2.txodds.com/feed/odds/xml.php?ident=gjelstabet&passwd=8678y7u7&bid=5,6,17,22,30,42,43,44,567,83,84,613,109,110,118,532,635,126,158,342&spid=1,3,6&ot=0,1,3,4,5&days=0,1&last=1455106594')
//   //     .then(res => res.text())
//   //     .then(xmlToJson)
//   //     .then(parseOdds)
//   //     .then(result => {
//   //       return Promise.all([mongoose.model('Match').upsertBulk(result.matches),
//   //                          mongoose.model('Offer').upsertBulk(result.offers),
//   //                          Promise.resolve(result.matches)])
//   //     }).spread((matchResult, offerResult, matches) => {
//   //       expect(matchResult.ok).to.be.ok
//   //       expect(offerResult.ok).to.be.ok
//   //       console.log(matches)
//   //       done()
//   //     }).catch(done)
//   // })
// })
