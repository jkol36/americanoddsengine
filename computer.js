import {
  oddsTypeFilters, ODDSTYPES,
  THREEWAY_ITERATOR, TWOWAY_ITERATOR,
  BASELINE_BOOKMAKER,
  calculateKelly
} from './helpers'
import _ from 'underscore'

export function groupOffers(offers) {
  return _
    .chain(offers)
    .groupBy(offer => offer.odds.o3)
    .value()
}

export function computeEdges(groups) {
  let edges = {}
  for (let group of groups) {
    for (let f of oddsTypeFilters) {
      let subOffers = group.offers.filter(f)
      if (subOffers.length > 1) {
        switch(subOffers[0].oddsType) {
          case ODDSTYPES.threeway:
            Object.assign(edges, findThreewayEdges(group.match, subOffers))
            break
          case ODDSTYPES.moneyline:
          case ODDSTYPES.dnb:
            Object.assign(edges, findTwowayEdges(group.match, subOffers))
            break
          default:
            let subgroups = groupOffers(subOffers)
            for (let line in subgroups) {
              if (subgroups[line].length > 1) {
                Object.assign(edges, findTwowayEdges(group.match, subgroups[line]))
              }
            }
            break
        }
      }
    }
  }
  return edges
}

export function findThreewayEdges(match, offers) {
  let edges = {}
  for (let output of THREEWAY_ITERATOR) {
    offers.sort((a, b) => {
      return b.odds[output] - a.odds[output]
    })
    for (let i = 0; i < offers.length; i++) {
      if (offers[i].bookmaker._id === BASELINE_BOOKMAKER) {
        const baseline = Math.round(offers[i].odds[output] / ( 1 / (
                          1 / offers[i].odds.o1 +
                          1 / offers[i].odds.o2 +
                          1 / offers[i].odds.o3)
                          ) * 1000) / 1000
        for (let j = 0; j < i; j++) {
          const edge = Math.round(((offers[j].odds[output] / baseline) - 1) * 100 * 10) / 10
          if (edge >= 1) {
            if (edge <= 30) {
              edges[offers[j]._id] = {
                _id: offers[j]._id,
                offer: offers[j]._id,
                edge: Math.round(edge * 100) / 100,
                bookmaker: offers[j].bookmaker,
                oddsType: offers[j].oddsType,
                matchId: match._id,
                homeTeam: match.homeTeam.name,
                awayTeam: match.awayTeam.name,
                competition: match.competition,
                startTime: match.startTime.getTime(),
                sportId: match.sportId,
                country: match.country,
                output: output,
                odds: offers[j].odds[output],
                baseline: baseline,
                createdAt: new Date().getTime(),
                kelly: calculateKelly(offers[j].odds[output], baseline),
                wager: 100,
                status: 1
              }
            }
          } else {
            break // If this one is not an edge, the next ones aren't either
          }
        }
        break // No reason to continue after we've hit the baselinebookie
      }
    }
  }
  return edges
}

export function findTwowayEdges(match, offers) {
  let edges = {}
  for (let output of TWOWAY_ITERATOR) {
    offers.sort((a, b) => {
      return b.odds[output] - a.odds[output]
    })
    for (let i = 0; i < offers.length; i++) {
      if (offers[i].bookmaker._id === BASELINE_BOOKMAKER) {
        const baseline = Math.round(offers[i].odds[output] / ( 1 / (
                          1 / offers[i].odds.o1 +
                          1 / offers[i].odds.o2)
                          ) * 1000) / 1000
        for (let j = 0; j <= i; j++) {
          const edge = Math.round(((offers[j].odds[output] / baseline) - 1) * 100 * 10) / 10
          if (edge >= 1) {
            if (edge <= 30) {
              edges[offers[j]._id] = {
                offer: offers[j]._id,
                edge: edge,
                odds: offers[j].odds[output],
                bookmaker: offers[j].bookmaker,
                oddsType: offers[j].oddsType,
                matchId: match._id,
                homeTeam: match.homeTeam.name,
                awayTeam: match.awayTeam.name,
                startTime: match.startTime.getTime(),
                competition: match.competition,
                sportId: match.sportId,
                country: match.country,
                output: output,
                oddsTypeCondition: offers[j].odds.o3,
                baseline: baseline,
                createdAt: new Date().getTime(),
                kelly: calculateKelly(offers[j].odds[output], baseline),
                wager: 100,
                status: 1
              }
            }
          } else {
            break // If this one is not an edge, the next ones aren't either
          }
        }
        break // No reason to continue after we've hit the baselinebookie
      }
    }
  }
  return edges
}
