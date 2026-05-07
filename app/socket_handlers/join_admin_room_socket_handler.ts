import type { Socket } from 'socket.io'

export async function joinAdminRoomSocketHandler(socket: Socket) {
  socket.join('room:admins')

  socket.on('disconnect', () => {
    console.log('Admin disconnected => ', socket.id)
  })
}
