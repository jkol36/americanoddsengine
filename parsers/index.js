import COUNTRIES from '../config/countries'
import BOOKMAKERS from '../config/bookmakers'

export function parseOdds(data) {
  let matches = {}
  let offers = {}
  let timestamp = +data.matches['$'].timestamp
  if (data === undefined) {
    throw new Error('Data is undefined')
  }
  if (!data.matches.match) {
    return {timestamp: timestamp, matches: {}, offers: {}}
  }
  data.matches.match.forEach(match => {
    let startTime = new Date(match.time[0])
    let subMatchID = +match['$'].id
    match.bookmaker.forEach(bookmaker => {
      let subBookmaker = {
        _id: +bookmaker['$'].bid,
        name: BOOKMAKERS[bookmaker['$'].bid]
      }
      bookmaker.offer.forEach(offer => {
        let offerProps = offer['$']
        let subOffer = {
          _id: +offerProps.id,
          oddsType: +offerProps.ot,
          lastUpdated: new Date(offerProps.last_updated),
          flags: Boolean(offerProps.flags === '1'),
          match: subMatchID,
          bookmaker: subBookmaker
        }
        let odds = offer.odds[offer.odds.length - 1]
        let o2 = +odds.o2[0]
        let o3
        if (!!odds.o3[0]['$']) {
          o3 = +odds.o3[0]['$'].dec
        } else {
          o3 = +odds.o3[0]
        }
        if (subOffer.oddsType === 1 || subOffer.oddsType === 6291457) {
          [o2, o3] = [o3, o2]
        }
        subOffer.odds = {
          o1: +odds.o1[0],
          o2: o2,
          o3: o3,
          time: new Date(odds['$'].time)
        }
        offers[subOffer._id] = subOffer
      })
    })
    matches[subMatchID] = {
      _id: subMatchID,
      startTime: startTime,
      homeTeam: {
        _id: +match.hteam[0]['$'].id,
        name: match.hteam[0]['_']
      },
      awayTeam: {
        _id: +match.ateam[0]['$'].id,
        name: match.ateam[0]['_']
      },
      competition: {
        _id: +match.group[0]['$'].cgid,
        name: match.group[0]['$'].cname
      },
      sportId: +match.group[0]['$'].spid,
      country: COUNTRIES[match.group[0]['$'].cnid]
    }
  })
  return {
    matches: matches,
    offers: offers,
    timestamp: timestamp
  }
}
