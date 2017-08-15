import { xmlToJson } from './helpers'
import mongoose from 'mongoose'
import fetch from 'node-fetch'


const UPDATE_URL = `http://xml2.txodds.com/feed/boid_states.php?ident=gjelstabet&passwd=8678y7u7&bid=${process.env.BOOKMAKERS}&spid=${process.env.SPORTS}&ot=${process.env.ODDS_TYPES}&days=${process.env.DAYS_AHEAD - 1}&live=0`
const THRESHOLD = 60
const TIMEOUT = 20000

export function fetchOfferUpdates(timestamp) {
  if (new Date().getTime() / 1000 - timestamp > THRESHOLD) {
    console.log('Timestamp is too old')
    return Promise.resolve({})
  }
  return new Promise((resolve, reject) => {
    fetch(UPDATE_URL + `&type=update&last=${timestamp}`, { timeout: TIMEOUT})
      .then(res => res.text())
      .then(xmlToJson)
      .then(json => {
        let updates = {}
        if (json.boids.boid) {
          json.boids.boid.forEach(boid => {
            let row = boid['$']
            updates[row.id] = new Date(row.last_updated)
          })
        }
        resolve(updates)
      }).catch(err => {
        console.log(err)
        resolve({})
      })
  })
}

export function fetchOfferChanges(timestamp) {
  return new Promise((resolve, reject) => {
    fetch(UPDATE_URL + `&type=change&last=${timestamp}`, { timeout: TIMEOUT})
      .then(res => res.text())
      .then(xmlToJson)
      .then(json => {
        let updates = {}
        if (json.boids.boid) {
          json.boids.boid.forEach(boid => {
            let row = boid['$']
            updates[row.id] = row.flags === '1'
          })
        }
        resolve(updates)
      }).catch(err => {
        console.log(err)
        resolve({})
      })
  })
}
