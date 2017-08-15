import { combineReducers, createStore, applyMiddleware } from 'redux'
import { firebaseRef } from './config'

const NEW_EDGE = 'NEW_EDGE'
const NEW_EDGES = 'NEW_EDGES'
const EDGE_DELETED = 'EDGE_DELETED'
const EDGE_CHANGED = 'EDGE_CHANGED'
const TIMESTAMP_CHANGED = 'TIMESTAMP_CHANGED'
const NEW_MATCH = 'NEW_MATCH'

// export function updateEdges(edges, matches) {
//   return (dispatch, getState) => {
//     let oldEdges = getState().edges
//     let fannedUpdates = {}
//     let removedEdges = []
//     let updatedEdges = []
//     for (let key in oldEdges) {
//       let oldEdge = oldEdges[key]
//       if (matches[oldEdge.matchId] !== undefined) { // Only do updates for the current matches
//         let edge = edges[key]
//         if (edge === undefined) {
//           removedEdges.push(key)
//         } else {
//           if (edge.odds === oldEdge.odds && edge.baseline === oldEdge.baseline) {
//             delete edges[key] // No need to update - already exists
//           } else {
//             updatedEdges.push(key)
//           }
//         }
//       }
//     }
//     for (let key in edges) {
//       fannedUpdates[key] = edges[key]
//     }
//     for (let removedKey of removedEdges)
//       fannedUpdates[removedKey] = null
//     for (let updatedKey of updatedEdges) {
//       let edge = edges[updatedKey]
//       delete fannedUpdates[updatedKey]
//       fannedUpdates[`${updatedKey}/baseline`] = edge.baseline
//       fannedUpdates[`${updatedKey}/odds`] = edge.odds
//       fannedUpdates[`${updatedKey}/edge`] = edge.edge
//       fannedUpdates[`${updatedKey}/kelly`] = edge.kelly
//     }
//     firebaseRef.update(fannedUpdates)
//   }
// }

// export function newEdge(key, edge) {
//   return {
//     type: NEW_EDGE,
//     key,
//     edge
//   }
// }

// export function newEdges(edges) {
//   return {
//     type: NEW_EDGES,
//     edges
//   }
// }

// export function edgeChanged(key, edge) {
//   return {
//     type: EDGE_CHANGED,
//     key,
//     edge
//   }
// }

// export function edgeDeleted(key) {
//   return {
//     type: EDGE_DELETED,
//     key
//   }
// }

export function timestampChanged(timestamp) {
	console.log('timestamp changed')
  return {
    type: TIMESTAMP_CHANGED,
    timestamp
  }
}

export function newMatch(key) {
  return {
    type: NEW_MATCH,
    key: key
  }
}

function edges(state={}, action) {
  switch(action.type) {
    case NEW_EDGE:
      return Object.assign({}, state, {
        [ action.key ]: action.edge
      })
    case EDGE_DELETED:
      let edges = state
      delete edges[action.key]
      return edges
    default:
      return state
  }
}

function timestamp(state=1464463607, action) {
  switch(action.type) {
    case TIMESTAMP_CHANGED:
      return action.timestamp
    default:
      return state
  }
}

export const store = createStore(combineReducers({
  edges,
  timestamp
}), applyMiddleware(require('redux-thunk')))
