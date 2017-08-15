// import Pusher from 'pusher-client'
// let socket = new Pusher('c11ef000e51c34bac2fc')
// import { firebaseRef } from '../config'

// describe('Old vs new', function()  {
//   it('Should test old vs new', function(done) {
//     this.timeout(10000000)
//     let newOffers = {}
//     let newDeleted = {}
//     let oldOffers = {}
//     let oldDeleted = {}
//     let trans = {}
//     let olderOnly = []
//     firebaseRef.on('child_added', snap => {
//       if (!!oldOffers[snap.key()]) {
//         console.log('Old is faster on', snap.key())
//       } else {
//         console.log('Newer is faster on', snap.key())
//       }
//       newOffers[snap.key()] = true
//     })
//     firebaseRef.on('child_removed', snap => {
//       delete newOffers[snap.key()]
//       newDeleted[snap.key()] = true
//     })
//     // let channel = socket.subscribe('edgebets')
//     channel.bind('edge_changes', data => {
//       data.deleted_edges.forEach(edge => {
//         delete newOffers[trans[edge]]
//         oldDeleted[trans[edge]] = true
//       })
//       data.new_edges.forEach(edge => {
//         let key = edge.o2.offer.id
//         if (!!newOffers[key]) {
//           if (!!newDeleted[key]) {
//             console.log('New already deleted')
//           }
//           console.log('Newer is faster on', key)
//         } else {
//           olderOnly.push(edge.id)
//           console.log('Older is faster on', key)
//         }
//         oldOffers[key] = true
//         oldOffers[edge.id] = key
//       })
//     })
//     setInterval(() => {
//       console.log('Old: %s, New: %s', Object.keys(oldOffers).length, Object.keys(newOffers).length)
//       console.log('DELETED Old: %s, New: %s', Object.keys(oldDeleted).length, Object.keys(newDeleted).length)
//       olderOnly = olderOnly.filter(edge => !oldDeleted[edge])
//       console.log('older only', olderOnly)
//     }, 10000)
//   })
// })
