import { Server } from 'socket.io'
import type { Server as HttpServer } from 'node:http'

class WebsocketServer {
  private io: Server | null = null
  private booted = false

  public boot(httpServer: HttpServer) {
    if (this.booted) return

    this.booted = true

    this.io = new Server(httpServer, {
      cors: {
        origin: '*',
      },
    })
  }

  public getInstanceOfServer(): Server {
    if (!this.io || !this.booted) {
      throw new Error('WebSocket server not booted')
    }
    return this.io
  }
}

export default new WebsocketServer()
