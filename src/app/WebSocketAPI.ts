import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import {AppComponent} from './app.component';

export class WebSocketAPI {
  webSocketEndPoint = 'ws://localhost:7435/commonNotifications/websocket';
  topic = '/user/queue/custom_offer';
  token: string = '3-eyJhbGciOiJIUzUxMiJ9.eyJhdWQiOiI4M2U2NzVhNWE3YmEwODNmM2E5MDk2YjkzYmY5NjBiOSIs' +
    'InN1YiI6InRlc3RfcmVnaW9uYWxAZ21haWwuY29tIiwiaXNzIjoiMDowOjA6MDowOjA6MDoxIiwiZXhwIjoxNjg4MjAzODY' +
    'yfQ.FWMFEuoQFHsLCTN-54XvqRD4oLy1HcRhq6Wb3ifgeY2Y_tiWh2tJqmGe-zBXlAY6uCQuFiqfwMmX7-xxMJi2FA';
  stompClient: any;
  appComponent: AppComponent;

  constructor(appComponent: AppComponent) {
    this.appComponent = appComponent;
  }

  _connect() {
    console.log('Initialize WebSocket Connection');
    const webSocket = new WebSocket(this.webSocketEndPoint);
    // let ws = new SockJS(this.webSocketEndPoint);
    this.stompClient = Stomp.over(webSocket);
    const pThis = this;
    this.stompClient.connect({'X-AUTH-TOKEN': this.token}, frame => {
      pThis.stompClient.subscribe(pThis.topic, sdkEvent => {
        pThis.onMessageReceived(sdkEvent);
      });
      // pThis.stompClient.reconnect_delay = 2000;
    }, this.errorCallBack);
  }

  _disconnect() {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }
    console.log('Disconnected');
  }

  // on error, schedule a reconnection attempt
  errorCallBack(error) {
    console.log('errorCallBack -> ' + error);
    setTimeout(() => {
      this._connect();
    }, 5000);
  }

  /**
   * Send message to sever via web socket
   * @param {*} message
   */
  _send(message) {
    console.log('calling api via web socket');
    console.log('message = ' + message);
    this.stompClient.send('/app/test', {}, JSON.stringify(message));
  }

  onMessageReceived(message) {
    console.log('Message Received from Server :: ' + message);
    this.appComponent.handleMessage(JSON.stringify(message));
  }
}
