export default class WS {

  public isReady: boolean = false;
  private static instance: WS;
  private ws: WebSocket|undefined = undefined;
  private wssUrl: string = '';

  private constructor() { }

  public static getInstance(): WS {
    if (!WS.instance) {
      WS.instance = new WS()
    }
    return WS.instance
  }

  async connect(wssUrl: string): Promise<Error|true> {
    this.wssUrl = wssUrl;
    this.ws = new WebSocket(this.wssUrl);
    const isConnected: Error|true = await this.waitConnection();
    if (isConnected === true) {
      this.ws.onmessage = this.onMessage;
      //setInterval(() => this.heartbeat(), 10000);
      this.isReady = true;
      return true;
    }
    return isConnected
  }

  waitConnection(): Promise<Error|true> {
    return new Promise((resolve, reject) => {
      if (this.ws !== undefined) {
        this.ws.onopen = function() {
          resolve(true)
        }
        this.ws.onerror = function(err) {
          reject(err)
        }
      } else {
        throw new Error('WebSocket connection failed')
      }
    })
  }

  onMessage(event) {
    const received = JSON.parse(event.data)
    console.log('received', received)
  }
  
  sendMessage(message: string): void {
    if (this.ws !== undefined) {
      this.ws.send(message)
    } else {
      throw new Error('WebSocket connection failed')
    }
  }

  heartbeat(): void {
    if (this.ws !== undefined) {
      this.ws.send('--heartbeat--')
    } else {
      throw new Error('WebSocket connection failed')
    }
  }
}