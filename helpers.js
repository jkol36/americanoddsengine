import xmlparser from 'xml2js'
import fetch from 'node-fetch'
import { ODDSFEED_BASE_URL } from './config'

export function xmlToJson(xml) {
  return new Promise((resolve, reject) => {
    const parser = new xmlparser.Parser()
    parser.parseString(xml, (err, data) => {
      if (!!err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

export function fetchXml(url) {
  return fetch(url).then(res => res.text()).then(xmlToJson)
}

export function getInitialUrls() {
  return new Promise((resolve, reject) => {
    fetchXml(`http://xml2.txodds.com/feed/competitions.php?ident=gjelstabet&passwd=8678y7u7&active=1&sid=15,16&spid=${process.env.SPORTS}`)
      .then(json => {
        let urls = {}
        json.competitions.competition.forEach(competition => {
          urls[competition['$'].cgid] = true
        })
        resolve(Object.keys(urls).map(cgid => ODDSFEED_BASE_URL + `&last=0&cgid=${cgid}`))
      }).catch(reject)
  })
}

export const oddsTypeFilters = [
  (offer) => {
    return offer.oddsType === ODDSTYPES.threeway
  },
  (offer) => {
    return (offer.oddsType === ODDSTYPES.moneyline ||
            offer.oddsType === ODDSTYPES.dnb ||
            (offer.oddsType === ODDSTYPES.ahc && offer.odds.o3 === 0)
            )
  },
  (offer) => {
    return offer.oddsType === ODDSTYPES.ahc && offer.odds.o3 !== 0
  },
  (offer) => {
    return offer.oddsType === ODDSTYPES.totals
  },
  (offer) => {
    return offer.oddsType === ODDSTYPES.points
  }
]

export const ODDSTYPES = {
  threeway: 0,
  moneyline: 1,
  points: 3,
  totals: 4,
  ahc: 5,
  totalsht: 65540,
  threewayht: 65536,
  dnb: 6291457,
  totalcorners: 9437188,
  totalcornersht: 9502724,
  ehc: 8388608
}

export const THREEWAY_ITERATOR = ['o1', 'o2', 'o3']
export const TWOWAY_ITERATOR = ['o1', 'o2']
export const BASELINE_BOOKMAKER = 83


export function calculateKelly(odds, baseline) {
  let winRate = 1 / baseline
  odds = odds - 1
  return (odds * winRate - (1 - winRate)) / odds
}
