import type { ApplicationService } from '@adonisjs/core/types'
import WebsocketServer from '#infrastructure_providers/internals/websocket_server'

export default class WebsocketProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  register() {}

  /**
   * The container bindings have booted
   */
  async boot() {}

  /**
   * The application has been booted
   */
  async start() {}

  /**
   * The process has been started
   */
  async ready() {
    if (this.app.getEnvironment() === 'web') {
      const adonisServer = await this.app.container.make('server')

      const httpServer = adonisServer.getNodeServer()

      if (!httpServer) {
        throw new Error('HTTP server not available')
      }

      // Boot with the actual Node.js HTTP server
      WebsocketServer.boot(httpServer)

      const io = WebsocketServer.getInstanceOfServer()

      io.on('connection', (socket) => {
        console.log('New Websocket Connection => ', socket.id)

        socket.on('new-gps-message-from-driver-app', (data) => {
          console.log('New GPS Message from Driver App => ', data)
        })

        socket.on('disconnect', (disconnectedSocket) => {
          console.log('Websocket Disconnected => ', disconnectedSocket)
        })
      })
    }
  }

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {}
}
