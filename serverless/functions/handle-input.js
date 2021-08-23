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
  
      // process customer's message
      const {
        result: { output: watsonOutput, context: watsonContext }
      } = await assistant.message({
        assistantId: process.env.WATSON_ASSISTANT_ID,
        sessionId: event.sessionId.trim(),
        input: {
          message_type: "text",
          text: event.body,
          options: {
            return_context: true
          }
        },
        context: {
          skills: {
            "main skill": {
              user_defined: {
                number: event.number
              }
            }
          }
        }
      });
  
      //extract information from processed Watson response
      const watsonResponse = watsonOutput.generic[0].text;
  
      const watsonContextVariables =
        watsonContext.skills["main skill"] &&
        watsonContext.skills["main skill"].user_defined;
  
      //  return processed response
      callback(null, {
        contextVariables: watsonContextVariables,
        response: watsonResponse
      });
    } catch (error) {
      callback(error);
    }
  };
  