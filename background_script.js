// Put all the javascript code here, that you want to execute in background.
const state = {
  query: "",
  variables: {},
};

function update(message) {
  switch (message.type) {
    case "update_query":
      state.query = message.payload;
      console.log(state);
      break;
    default:
      console.error(
        "Unrecognized message.type: ",
        message.type,
        "from message: ",
        message
      );
      break;
  }
}

browser.runtime.onMessage.addListener(update);
