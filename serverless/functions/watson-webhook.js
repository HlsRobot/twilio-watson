exports.handler = async function(context, event, callback) {
  const Yelp = require("yelp-fusion");
  try {
    const action = event.action;

    switch (action) {
      case "lookup":
        //lookup restaurants in Yelp
        const yelpClient = Yelp.client(context.YELP_API_KEY);
        const client = context.getTwilioClient();

        await client.messages.create({
          body: `One moment while I look for a restaurant in ${event.city} for ${event.category} food...`,
          from: "whatsapp:+14155238886",
          to: event.number
        });

        const searchRequest = {
          term: event.category,
          location: event.city,
          limit: 3
        };

        const yelpSearchRequest = await yelpClient.search(searchRequest);

        const lookupResult =
          yelpSearchRequest.jsonBody && yelpSearchRequest.jsonBody.businesses;

        // if restaurants could be found share the first 3 via Whatsapp
        if (lookupResult.length) {
          await Promise.all([
            lookupResult.map(async business => {
              return client.messages.create({
                body:
                  "Name: _" +
                  business.name +
                  "_\nRating: _" +
                  business.rating +
                  "_\nPrice: _" +
                  business.price +
                  "_\nTel: _" +
                  business.phone +
                  "_\nURL: ```" +
                  business.url +
                  "```",
                from: "whatsapp:+14155238886",
                to: event.number,
                mediaUrl: business.image_url
              });
            })
          ]);
        }

        //If no restaurants were found notify the user
        else {
          await client.messages.create({
            body: `Unfortunately I couldn't find anything for you.`,
            from: "whatsapp:+14155238886",
            to: event.number
          });
        }

        // send follow up question after 4 seconds
        setTimeout(() => {
          callback(null, {
            responseText: "Is there anything else I can help you with?"
          });
        }, 4000);

        break;
      default:
        callback(null, {
          responseText:
            "Sorry I'm not sure how to handle the request. Please try again."
        });
    }
  } catch (error) {
    console.log(error);
    callback(error);
  }
};
