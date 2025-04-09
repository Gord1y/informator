import { Injectable, OnModuleDestroy } from '@nestjs/common'
import http from 'http'
import { UserService } from 'src/modules/user/user.service'
import { RawData, WebSocket, WebSocketServer } from 'ws'

interface WsClient {
  id: string
  socket: WebSocket
  apiKey?: string
  username?: string
}

@Injectable()
export class WsService implements OnModuleDestroy {
  private server: WebSocketServer
  private clients: { [id: string]: WsClient } = {}
  private activeStreamers: Map<string, string> = new Map()

  constructor(private readonly userService: UserService) {}

  start(httpServer: http.Server): void {
    this.server = new WebSocketServer({ server: httpServer })
    console.log('[ws] Listening for WebSocket connections')
    this.server.on('connection', (ws: WebSocket, req: http.IncomingMessage) => {
      this.handleConnection(ws, req)
    })
  }

  async onModuleDestroy() {
    if (this.server) {
      this.server.close()

      if (this.clients) {
        for (const clientId in this.clients) {
          const client = this.clients[clientId]
          client.socket.close()
        }
      }

      if (this.activeStreamers) {
        for (const streamer of this.activeStreamers.values()) {
          if (this.activeStreamers.get(streamer)) {
            this.activeStreamers.delete(streamer)
          }

          await this.userService.update(streamer, { isStreamActive: false })
          console.log(`[ws] Stopping stream for user ${streamer}`)
        }
      }
    }
  }

  private handleConnection(ws: WebSocket, req: http.IncomingMessage): void {
    const id = `${req.socket.remoteAddress}:${req.socket.remotePort}`
    const client: WsClient = { id, socket: ws }
    this.clients[id] = client
    console.log(`[ws] Client ${client.id} connected`)

    ws.on('error', error => console.error('[ws] error:', error))
    ws.on('message', (data: RawData) => this.onMessage(data, client))
    ws.on('close', () => {
      console.log(`[ws] Client ${client.id} disconnected`)
      if (
        client.username &&
        this.activeStreamers.get(client.username) === client.id
      ) {
        this.activeStreamers.delete(client.username)
      }
      delete this.clients[client.id]
    })
  }

  private async onMessage(buffer: RawData, client: WsClient) {
    let action: {
      type: string
      payload: {
        [key: string]: unknown
      }
    }
    try {
      action = JSON.parse(buffer.toString())
    } catch (error) {
      console.error('[ws] Failed to parse message:', error)
      return
    }

    console.log(`[ws] Client ${client.id} sent: ${JSON.stringify(action)}`)

    switch (action.type) {
      case 'authenticate': {
        if (client.apiKey) {
          return this.sendError(
            client,
            'Already authenticated. Disconnect first.'
          )
        }
        const apiKey = action.payload as unknown as string
        if (!apiKey) {
          return this.sendError(client, 'API key is required.')
        }
        const user = await this.userService.findByStreamKey(apiKey)
        if (!user) {
          console.log(`[ws] Invalid API key: ${apiKey}`)
          this.sendError(client, 'Invalid API key.')
          client.socket.close()
          return
        }
        client.apiKey = apiKey
        client.username = user.username
        console.log(
          `[ws] Client ${client.id} authenticated with API key ${apiKey}`
        )
        this.sendMessage(
          'authenticated',
          { message: 'Authenticated successfully.' },
          client
        )
        break
      }
      case 'startStream': {
        if (!client.apiKey) {
          return this.sendError(client, 'Not authenticated.')
        }
        const user = await this.userService.findByStreamKey(client.apiKey)
        if (!user) {
          console.log(`[ws] Invalid API key: ${client.apiKey}`)
          this.sendError(client, 'Invalid API key.')
          client.socket.close()
          return
        }
        await this.userService.update(user.id, { isStreamActive: true })
        if (user.username) {
          this.activeStreamers.set(user.username, client.id)
        }
        console.log(`[ws] Starting stream for user ${user.email}`)
        break
      }
      case 'stopStream': {
        if (!client.apiKey) {
          return this.sendError(client, 'Not authenticated.')
        }
        const user = await this.userService.findByStreamKey(client.apiKey)
        if (!user) {
          console.log(`[ws] Invalid API key: ${client.apiKey}`)
          this.sendError(client, 'Invalid API key.')
          client.socket.close()
          return
        }
        await this.userService.update(user.id, { isStreamActive: false })
        if (
          user.username &&
          this.activeStreamers.get(user.username) === client.id
        ) {
          this.activeStreamers.delete(user.username)
        }
        console.log(`[ws] Stopping stream for user ${user.email}`)
        break
      }
      default:
        this.sendError(client, `Unknown message type: ${action.type}`)
    }
  }

  private sendError(client: WsClient, message: string) {
    client.socket.send(JSON.stringify({ type: 'error', payload: { message } }))
  }

  private sendMessage(type: string, payload: unknown, client: WsClient) {
    client.socket.send(JSON.stringify({ type, payload }))
  }
}
