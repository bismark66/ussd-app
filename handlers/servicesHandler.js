const { crops } = require("../config/constants");

const handleEsokoServices = (userData, page, serviceType, lastResponse) => {
  let message = "Invalid option.";
  let nextPage = page;
  let continueSession = true;
  let additionalData = {};

  switch (page) {
    case 2:
      switch (userData) {
        case "1":
          console.log("lastResponse", lastResponse);
          console.log("serviceType", serviceType);
          console.log("page", page);
          console.log(userData);
          message =
            "Select a crop to find their market prices" +
            "\n1. Maize" +
            "\n2. Rice" +
            "\n3. Yam" +
            "\n4. Beans" +
            "\n5. Back" +
            "\n6. Exit";
          nextPage = 3;
          break;
        // ... other cases
        case "2": // Weather Info
          message =
            "Select channel for receiving Weather Information" +
            "\n1. SMS" +
            "\n2. Voice" +
            "\n3. Back" +
            "\n4. Exit";
          nextPage = 3;
          break;
        // ... other cases
        case "3": // Agronomic advice
          message =
            "Select channel for receiving Agronomic advice" +
            "\n1. SMS" +
            "\n2. Voice" +
            "\n3. Back" +
            "\n4. Exit";
          nextPage = 3;
          break;
        // ... other cases
        case "4": // Climate smart advisor
          message =
            "We have received your request, an agent will contact you shortly" +
            "\n1. Back" +
            "\n2. Exit";
          page = 3;
          break;
        // ... other cases
        case "5": // Bids and offers
          message =
            "We have received your Bid/Offer request, an agent will contact you shortly" +
            "\n1. Back" +
            "\n2. Exit";
          page = 3;
          break;
        // ... other cases
        case "6": // Back to main menu
          message =
            "Welcome to Esoko DigMKT Services." +
            "\n1. Sign Up" +
            "\n2. Esoko Services" +
            "\n3. Exit";
          nextLevel = 0;
          nextPage = 1;
          break;
        // ... other cases
        case "#": // Exit
          message = "Goodbye!";
          //   nextPage = 0;
          continueSession = false;
          break;
        default:
          message = "Invalid option. Please select 1-6.";
      }
      break;

    case 3:
      switch (serviceType) {
        case "ClimateSmartAdvisor":
        case "BidsAndOffers":
          switch (userData) {
            case "1":
              console.log("git hegeg", serviceType);
              message =
                "Esoko Services" +
                "\n1. Market Prices" +
                "\n2. Weather Info" +
                "\n3. Agronomic advice" +
                "\n4. Climate smart advisor" +
                "\n5. Bids and offers" +
                "\n6. Back" +
                "\n\n#. Exit";
              level = 2;
              page = 1;
              break;
            case "2":
              message = "Thank you for using our service. Goodbye!";
              continueSession = false;
              break;
            default:
              message = "Invalid option. Please select 1-2.";
          }
          break;
        case "MarketPrices":
          switch (userData) {
            case "1":
            case "2":
            case "3":
              //   console.log("got here", lastResponse);
              //   additionalData.cropSelected = userData;
              message =
                "Your have selected " +
                crops[userData] +
                ` Are you sure?` +
                "\n1. Confirm and Save" +
                "\n2. Back " +
                "\n3. Main menu" +
                "\n#. Exit";
              nextPage = 4;
              serviceType = "MarketPrices";
              additionalData.cropSelected = crops[userData];
              break;

            case "4":
              message = "Thank you for using our service. Goodbye!";
              continueSession = false;
              break;
            default:
              message = "Invalid option. Please select 1-4.";
          }
          break;
      }
      break;

    case 4:
      switch (serviceType) {
        case "MarketPrices":
          switch (userData) {
            case "1": // Add another crop
              console.log("got here", lastResponse);
              message =
                `${lastResponse.cropSelected}` +
                " has been added " +
                //   "Price alert subscription confirmed!\n" +
                //   "You will receive SMS alerts when prices change.\n\n" +
                "\n1. Add another crop" +
                "\n2. Select market" +
                "\n\n3. Exit";
              console.log("");
              break;
          }
          break;
      }
    // ... other cases
  }

  return {
    message,
    page: nextPage,
    continueSession,
    serviceType,
  };
};

module.exports = handleEsokoServices;
