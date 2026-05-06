import type { ApplicationService } from '@adonisjs/core/types'
import WebsocketServer from '#infrastructure_providers/internals/websocket_server'
import { registerCustomerSocketHandler } from '#socket_handlers/register_customer_socket_handler'
import { logBookingGpsCoordinatesSocketHandler } from '#socket_handlers/log_booking_gps_coordinates_socket_handler'

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

      WebsocketServer.boot(httpServer)
      const io = WebsocketServer.getInstanceOfServer()

      io.on('connection', async (socket) => {
        console.log('New Websocket Connection => ', socket.id)

        await registerCustomerSocketHandler(socket)
        await logBookingGpsCoordinatesSocketHandler(io, socket)
      })
    }
  }

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {}
}
