exports.handler = async function(context, event, callback) {
  const { IamAuthenticator } = require("ibm-watson/auth");
  const AssistantV2 = require("ibm-watson/assistant/v2");

  try {
    // initialize Watson Assistant
    const assistant = new AssistantV2({
      version: "2020-09-24",
      authenticator: new IamAuthenticator({
        apikey: context.WATSON_CLIENT_API_KEY
      }),
      serviceUrl: context.WATSON_SERVICE_URL
    });

    // create new session for Watson assistant
    const sessionRequest = await assistant.createSession({
      assistantId: context.WATSON_ASSISTANT_ID
    });

    const sessionId = sessionRequest.result.session_id;

    callback(null, { sessionId });
  } catch (error) {
    console.log(error);
    callback(error);
  }
};
