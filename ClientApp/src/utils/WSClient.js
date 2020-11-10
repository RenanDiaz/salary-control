const BASE_URL = 'ws://localhost:5000/proxy';

let socket;
const subscriptions = [];

const messageType = {
  CONNECTION_ESTABLISHED: 0,
  JOINED: 1,
  MESSAGE: 2,
  LEFT: 3,
  ACTION_CONFIRMED: 4,
  ACTION_DENIED: 5,
};

// STATUS: 0: CONNECTING, 1: OPEN, 2: CLOSING, 3: CLOSED

function connect(callback) {
  console.log(socket);
  if (socket && socket.readyState !== socket.CLOSED && socket.readyState !== socket.CLOSING) {
    if (callback) {
      return callback();
    } else {
      return false;
    }
  }
  socket = new WebSocket(BASE_URL);

  socket.onopen = function (e) {
    console.log('Connected to ws');
  };

  socket.onclose = function (e) {
    console.log('Disconnected from ws');
    subscriptions.length = 0;
  };

  socket.onmessage = function (e) {
    const data = JSON.parse(e.data);
    console.log(data);
    switch (data.type) {
      case messageType.CONNECTION_ESTABLISHED:
        sendMessage({
          type: 'join',
          text: 'Test',
          date: Date.now(),
        });
        break;
      case messageType.MESSAGE:
        console.log(data.text);
        for (const subscription of subscriptions) {
          console.log('onMessage', { subscription });
          subscription.function();
        }
        break;
      case messageType.ACTION_CONFIRMED:
        console.log('action confirmed');
        break;
      default:
        break;
    }
  };

  socket.onerror = function (e) {
    console.error(e);
  };

  if (callback) {
    return callback();
  } else {
    return true;
  }
}

function sendMessage(message) {
  socket.send(JSON.stringify(message));
}

function assignId() {
  let id = 0;
  for (const subscription of subscriptions) {
    console.log('assign', { subscription });
    if (subscription.id === id) {
      id++;
    } else {
      break;
    }
  }
  return id;
}

export const ws = {
  subscribe(fn) {
    const callback = () => {
      const id = assignId();
      console.log('subscribed', id);
      subscriptions.push({ id, function: fn });
      console.log('subscribe', { subscriptions });
      return id;
    };
    if (socket && socket.readyState === socket.OPEN) {
      return callback();
    } else {
      return connect(callback);
    }
  },
  sendMessage(text) {
    sendMessage({
      type: 'message',
      text,
      date: Date.now(),
    });
  },
  unsubscribe(id) {
    if (socket && socket.readyState === socket.OPEN) {
      console.log(subscriptions.length);
      console.log('unsubscribed', id);
      const index = subscriptions.findIndex((subscription) => subscription.id === id);
      subscriptions.splice(index, 1);
      console.log(subscriptions.length);
      if (subscriptions.length === 0) {
        socket.close(1000, 'No subscriptions left.');
        console.log({ readyState: socket.readyState });
      }
    }
  },
};
