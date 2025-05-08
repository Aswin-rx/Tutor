// Polyfill for TextEncoder/TextDecoder
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Polyfill for BroadcastChannel
global.BroadcastChannel = class BroadcastChannel {
  constructor(channel) {
    this.channel = channel;
    this.listeners = {};
  }
  
  postMessage(message) {
    // Mock implementation
  }
  
  addEventListener(type, listener) {
    if (!this.listeners[type]) {
      this.listeners[type] = [];
    }
    this.listeners[type].push(listener);
  }
  
  removeEventListener(type, listener) {
    if (!this.listeners[type]) return;
    this.listeners[type] = this.listeners[type].filter(l => l !== listener);
  }
  
  close() {
    this.listeners = {};
  }
};

// Polyfill for fetch
require('whatwg-fetch');

// Polyfill for Response if needed
if (typeof Response === 'undefined') {
  global.Response = class Response {
    constructor(body, init) {
      this.body = body;
      this.init = init;
      this.status = init?.status || 200;
      this.ok = this.status >= 200 && this.status < 300;
      this.statusText = init?.statusText || '';
      this.headers = new Map(Object.entries(init?.headers || {}));
    }
    
    json() {
      return Promise.resolve(JSON.parse(this.body));
    }
    
    text() {
      return Promise.resolve(this.body);
    }
  };
}

// Polyfill for Response
if (typeof Response === 'undefined') {
  global.Response = class Response {
    constructor(body, init) {
      this.body = body;
      this.init = init;
      this.status = init?.status || 200;
      this.ok = this.status >= 200 && this.status < 300;
      this.statusText = init?.statusText || '';
      this.headers = new Map(Object.entries(init?.headers || {}));
    }
    
    json() {
      return Promise.resolve(JSON.parse(this.body));
    }
    
    text() {
      return Promise.resolve(this.body);
    }
  };
}