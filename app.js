var express = require("express");
const cache = require("memory-cache");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.use(cors());
app.options("*", cors());

const crops = {
  1: "Maize",
  2: "Rice",
  3: "Yam",
  4: "Beans",
};

const livestocks = {
  1: "Cows",
  2: "Goats",
  3: "Pigs",
  4: "Sheep",
};

const markets = {
  1: "Mallam market",
  2: "Kintampo market",
  3: "Makola market",
};

const channels = {
  1: "sms",
  2: "voice",
};

app.post("/ussd", (req, res) => {
  const { sessionID, userID, newSession, msisdn, userData, network } = req.body;

  console.log("USSD Request:", {
    sessionID,
    userID,
    newSession,
    msisdn,
    userData,
    network,
  });

  let userResponseTracker = cache.get(sessionID) || [];

  if (newSession) {
    const initialState = {
      sessionID,
      msisdn,
      userData,
      network,
      newSession,
      message:
        "Welcome to Esoko DigMKT Services." +
        "\n1. Sign Up" +
        "\n2. Esoko Service" +
        "\n3. Request Agent" +
        "\n4. Add Crops/Livestock" +
        "\n5. Exit",
      level: 0,
      page: 1,
    };

    userResponseTracker = [initialState];
    cache.put(sessionID, userResponseTracker);

    return res.status(200).json({
      userID,
      sessionID,
      message: initialState.message,
      continueSession: true,
      msisdn,
    });
  }

  // If no previous session found
  if (!userResponseTracker || userResponseTracker.length === 0) {
    return res.status(200).json({
      userID,
      sessionID,
      message: "Error! Please dial code again!",
      continueSession: false,
      msisdn,
    });
  }

  const lastResponse = userResponseTracker[userResponseTracker.length - 1];
  let message = "Invalid option. Please try again.";
  let continueSession = true;

  // Navigation and option handling
  try {
    switch (lastResponse.level) {
      case 0: // Main Menu
        switch (userData) {
          case "1": // Sign Up
            message =
              "Select Region?" +
              "\n1. Bono West" +
              "\n2. Bono East" +
              "\n3. Bono South" +
              "\n4. Back" +
              "\n\n #. Exit";
            userResponseTracker.push({
              ...lastResponse,
              level: 1,
              page: 2,
              message,
            });

            break;
          case "2": // Esoko Services
            message =
              "Esoko Services" +
              "\n1. Market Prices" +
              "\n2. Weather Info" +
              "\n3. Agronomic advice" +
              "\n4. Climate smart advisor" +
              "\n5. Bids and offers" +
              "\n6. Back" +
              "\n\n #. Exit";
            userResponseTracker.push({
              ...lastResponse,
              level: 2,
              page: 2,
              message,
            });

            break;
          case "3": // Request Agent
            message =
              "Request Agent" +
              "\n\nWe have received your request." +
              "\nAn agent will call you shortly." +
              "\n\n 1. Exit";
            userResponseTracker.push({
              ...lastResponse,
              level: 3,
              page: 2,
              message,
            });
            break;
          case "4": // Add Crops/Livestock
            message =
              "Select what you want to add" +
              "\n1. Crops" +
              "\n2. Livestock" +
              "\n3. Back" +
              "\n\n*. Exit";
            userResponseTracker.push({
              ...lastResponse,
              level: 4,
              page: 2,
              message,
            });
            break;
          case "5":
            message = "Thank you for using our service. Goodbye!";
            continueSession = false;
            break;
          default:
            message = "Invalid option. Please select 1-5.";
        }
        break;

      case 1:
        switch (lastResponse.page) {
          case 2:
            if (userData === "4") {
              // Back to Main Menu
              message =
                "Welcome to Esoko DigMKT Services." +
                "\n1. Sign Up" +
                "\n2. Esoko Service" +
                "\n3. Request Agent" +
                "\n4. Add Crops/Livestock" +
                "\n5. Exit";
              userResponseTracker.push({
                ...lastResponse,
                level: 0,
                page: 1,
                message,
              });
            } else if (["1", "2", "3"].includes(userData)) {
              message =
                "Hello Kofi Annan, would you like to activate an esoko account, with us? This gives you acess to all our services. To learn more about Esoko call 1900 toll free" +
                "\n1. Activate" +
                // "\n2. Back" +
                // "\n3. Exit" +
                // "\n4. Beans" +
                "\n2. Back" +
                "\n3. Exit";
              userResponseTracker.push({
                ...lastResponse,
                page: 3,
                selectedRegion: userData,
                message,
              });
            } else if (userData === "#") {
              // Exit
              message = "Thank you for using our service. Goodbye!";
              continueSession = false;
            } else {
              message = "Invalid option. Please select 1-4 or # to exit.";
            }
            break;

          case 3: // Crop Selection after Region
            switch (userData) {
              case "1": // Maize
                // const selectedCrop = crops[userData];
                message =
                  `What type of farmer are you` +
                  "\n1. Crop" +
                  "\n2. livestock" +
                  "\n#. Exit";
                userResponseTracker.push({
                  ...lastResponse,
                  page: 4,
                  //   selectedCrop: userData,
                  message,
                });
                break;

              case "2": // Back to Region Selection
                message =
                  "Select Region?" +
                  "\n1. Bono West" +
                  "\n2. Bono East" +
                  "\n3. Bono South" +
                  "\n4. Back" +
                  "\n\n#. Exit";
                userResponseTracker.push({
                  ...lastResponse,
                  page: 2,
                  message,
                });
                break;
              case "3": // Exit
                message = "Thank you for using our service. Goodbye!";
                continueSession = false;
                break;
              default:
                message = "Invalid option. Please select 1-6.";
            }
            break;

          case 4: // After Crop Selection
            switch (userData) {
              case "1":
                message =
                  "Add crops" +
                  "\n1. Maize" +
                  "\n2. Rice" +
                  "\n3. Yam" +
                  "\n4. Beans" +
                  "\n5. Back" +
                  "\n#. Exit";
                userResponseTracker.push({
                  ...lastResponse,
                  page: 5,
                  type: "crops",
                  message,
                });
                break;
              case "2": // Back to Crop Selection
                message =
                  "Add livestocks" +
                  "\n1. Cows" +
                  "\n2. Goats" +
                  "\n3. Pigs" +
                  "\n4. Sheep" +
                  "\n5. Back" +
                  "\n#. Exit" +
                  userResponseTracker.push({
                    ...lastResponse,
                    page: 5,
                    type: "livestock",
                    message,
                  });
                break;

              case "#": // Exit
                message = "Thank you for using our service. Goodbye!";
                continueSession = false;
                break;
              default:
                message = "Invalid option. Please select 1- 5 or #.";
            }
            break;

          case 5: // Final Step
            switch (userData) {
              case "1": // Return to Main Menu
              case "2":
              case "3":
              case "4":
                let product =
                  lastResponse.type === "crops"
                    ? crops[userData]
                    : livestocks[userData];
                message =
                  lastResponse.type === "crops"
                    ? `You have selected ${crops[userData]}.\n\n1. Confirm and Save\n2. Back to main menu\n3. Exit`
                    : lastResponse.type === "livestock"
                    ? `You have selected ${livestocks[userData]}.\n\n1. Confirm and Save\n2. Back to main menu\n3. Exit`
                    : "Invalid type.";
                userResponseTracker.push({
                  ...lastResponse,
                  page: 6,
                  product,
                  message,
                });
                break;
              case "5":
                message =
                  `What type of farmer are you` +
                  "\n1. Crop" +
                  "\n2. livestock" +
                  "\n#. Exit";
                userResponseTracker.push({
                  ...lastResponse,
                  page: 4,
                  //   selectedCrop: userData,
                  message,
                });
                break;

              case "#": // Exit
                message = "Thank you for using our service. Goodbye!";
                continueSession = false;
                break;
              default:
                message = "Invalid option. Please select 1 or #.";
            }
            break;
          case 6:
            switch (userData) {
              case "1": // Return to Main Menu
                message =
                  `Congratulations! ${lastResponse.product} has been added successfully.\n\n` +
                  "1. Add more crops/livestock\n" +
                  "3. Back to main menu\n" +
                  "6. Exit";

                userResponseTracker.push({
                  ...lastResponse,
                  page: 7,
                  message,
                });
                break;

              case "2": // Back to Main Menu
                message =
                  "Welcome to Esoko DigMKT Services." +
                  "\n1. Sign Up" +
                  "\n2. Esoko Service" +
                  "\n3. Request Agent" +
                  "\n4. Add Crops/Livestock" +
                  "\n5. Exit";
                userResponseTracker.push({
                  ...lastResponse,
                  level: 0,
                  page: 1,
                  message,
                });
                break;

              case "3": // Exit
                message = "Thank you for using our service. Goodbye!";
                continueSession = false;
                break;

              default: // Handle invalid input
                message = "Invalid selection. Please choose a valid option.";
                break;
            }
            break;
          case 7:
            switch (userData) {
              case "1":
                cacheLength = cache.get(sessionID).length;
                message = cache.get(sessionID)[cacheLength - 3].message;
                userResponseTracker.push({
                  ...lastResponse,
                  page: 3,
                  message,
                });
            }
            break;

          default: // Catch-all for invalid `case`
            message = "An error occurred. Please start over.";
            continueSession = false;
            break;
        }
        break;

      case 2: // Esoko Services
        switch (lastResponse.page) {
          case 2: // Initial Esoko Services Menu
            switch (userData) {
              case "1": // Market Prices
                message =
                  "Select a crop to find their market prices" +
                  "\n1. Maize" +
                  "\n2. Rice" +
                  "\n3. Yam" +
                  "\n4. Beans" +
                  "\n5. Back" +
                  "\n6. Exit";
                userResponseTracker.push({
                  ...lastResponse,
                  page: 3,
                  serviceType: "MarketPrices",

                  message,
                });
                break;
              case "2": // Weather Info
                message =
                  "Select channel for receiving Weather Information" +
                  "\n1. SMS" +
                  "\n2. Voice" +
                  "\n3. Back" +
                  "\n4. Exit";
                userResponseTracker.push({
                  ...lastResponse,
                  page: 3,
                  serviceType: "WeatherInfo",
                  message,
                });
                break;
              case "3": // Agronomic advice
                message =
                  "Select channel for receiving agronomic advice" +
                  "\n1. SMS" +
                  "\n2. Voice" +
                  "\n3. Back" +
                  "\n4. Exit";
                userResponseTracker.push({
                  ...lastResponse,
                  page: 3,
                  serviceType: "AgronomicAdvice",
                  message,
                });
                break;
              case "4": // Climate smart advisor
                message =
                  "We have received your request, an agent will contact you shortly" +
                  "\n1. Back" +
                  "\n2. Exit";
                userResponseTracker.push({
                  ...lastResponse,
                  page: 3,
                  serviceType: "ClimateSmartAdvisor",
                  message,
                });
                break;
              case "5": // Bids and offers
                message =
                  "We have received your Bid/Offer request, an agent will contact you shortly" +
                  "\n1. Back" +
                  "\n2. Exit";
                userResponseTracker.push({
                  ...lastResponse,
                  page: 3,
                  serviceType: "BidsAndOffers",
                  message,
                });
                break;

              case "6": // Back to Main Menu
                message =
                  "Welcome to Esoko DigMKT Services." +
                  "\n1. Sign Up" +
                  "\n2. Esoko Service" +
                  "\n3. Request Agent" +
                  "\n4. Add Crops/Livestock" +
                  "\n5. Exit";
                userResponseTracker.push({
                  ...lastResponse,
                  level: 0,
                  page: 1,
                  message,
                });
                break;
              case "#": // Exit
                message = "Thank you for using our service. Goodbye!";
                continueSession = false;
                break;
              default:
                message = "Invalid option. Please select 1-6.";
            }
            break;

          case 3: // Handling responses from previous selections
            switch (lastResponse.serviceType) {
              case "ClimateSmartAdvisor":
              case "BidsAndOffers":
                switch (userData) {
                  case "1": // Back
                    message =
                      "Esoko Services" +
                      "\n1. Market Prices" +
                      "\n2. Weather Info" +
                      "\n3. Agronomic advice" +
                      "\n4. Climate smart advisor" +
                      "\n5. Bids and offers" +
                      "\n6. Back" +
                      "\n\n #. Exit";
                    userResponseTracker.push({
                      ...lastResponse,
                      level: 2,
                      page: 2,
                      message,
                    });
                    break;
                  case "2": // Exit
                    message = "Thank you for using our service. Goodbye!";
                    continueSession = false;
                    break;
                  default:
                    message = "Invalid option. Please select 1-2.";
                }
                break;

              case "MarketPrices":
                switch (userData) {
                  case "1": // Mallam market
                  case "2": // Kintampo market
                  case "3": // Makola market
                  case "4":
                    const cropName = crops[userData];
                    const marketName = markets[userData];
                    message =
                      `You have selected ${cropName}!` +
                      ` Are you sure?` +
                      "\n1. Confirm and Save" +
                      "\n2. Back " +
                      "\n3. Main menu" +
                      "\n#. Exit";
                    userResponseTracker.push({
                      ...lastResponse,
                      page: 4,
                      //   marketSelected: userData,
                      cropSelected: userData,
                      serviceType: "MarketPrices",
                      message,
                    });
                    break;
                  case "5": // Back to crop selection
                    message =
                      "Select a crop to find their market prices" +
                      "\n1. Maize" +
                      "\n2. Rice" +
                      "\n3. Yam" +
                      "\n4. Beans" +
                      "\n5. Back" +
                      "\n6. Exit";
                    userResponseTracker.push({
                      ...lastResponse,

                      page: 3,
                      message,
                    });
                    break;
                  case "6": // Exit
                    message = "Thank you for using our service. Goodbye!";
                    continueSession = false;
                    break;
                  default:
                    message = "Invalid option. Please select 1-4.";
                }
                break;

              case "WeatherInfo":
              case "AgronomicAdvice":
                switch (userData) {
                  case "1": // Confirm and save
                    message =
                      `We have received your request` +
                      `You will receive ${channels[userData]} shortly ` +
                      "\n1. Back " +
                      "\n2. Exit";
                    //   "#. Exit";
                    userResponseTracker.push({
                      ...lastResponse,
                      page: 4,
                      //   subscriptionConfirmed: true,
                      message,
                    });
                    break;
                  case "2": // Back
                    message =
                      `We have received your request` +
                      `You will receive a call shortly ` +
                      "\n1. Back " +
                      "\n2. Exit";
                    userResponseTracker.push({
                      ...lastResponse,
                      page: 4,
                      message,
                    });
                    break;
                  case "3": // Exit
                    message = "Thank you for using our service. Goodbye!";
                    continueSession = false;
                    break;
                  default:
                    message = "Invalid option. Please select 1-3.";
                }
                break;
            }
            break;

          case 4: // Final level handling
            switch (lastResponse.serviceType) {
              case "MarketPrices":
                switch (userData) {
                  case "1": // Subscribe to price alerts
                    message =
                      crops[lastResponse.cropSelected] +
                      " has been added " +
                      "\n1. Add another crop" +
                      "\n2. Select market" +
                      "\n\n3. Exit";
                    userResponseTracker.push({
                      ...lastResponse,
                      page: 5,
                      serviceType: "MarketPrices",
                      //   subscribed: true,
                      message,
                    });
                    break;
                  case "2": // Back to markets
                    const cropName = crops[lastResponse.cropSelected];
                    message =
                      "Select a crop to find their market prices" +
                      "\n1. Maize" +
                      "\n2. Rice" +
                      "\n3. Yam" +
                      "\n4. Beans" +
                      "\n5. Back" +
                      "\n6. Exit";
                    userResponseTracker.push({
                      ...lastResponse,
                      page: 3,
                      message,
                    });
                    break;
                  case "3": // Main menu
                    message =
                      "Welcome to Esoko DigMKT Services." +
                      "\n1. Sign Up" +
                      "\n2. Esoko Service" +
                      "\n3. Request Agent" +
                      "\n4. Add Crops/Livestock" +
                      "\n5. Exit";
                    userResponseTracker.push({
                      ...lastResponse,
                      level: 0,
                      page: 1,
                      message,
                    });
                    break;
                  case "#": // Exit
                    message = "Thank you for using our service. Goodbye!";
                    continueSession = false;
                    break;
                  default:
                    message = "Invalid option. Please select 1-3 or #.";
                }
                break;

              case "WeatherInfo":
              case "AgronomicAdvice":
                switch (userData) {
                  case "1": // Back to services
                    message =
                      "Esoko Services" +
                      "\n1. Market Prices" +
                      "\n2. Weather Info" +
                      "\n3. Agronomic advice" +
                      "\n4. Climate smart advisor" +
                      "\n5. Bids and offers" +
                      "\n6. Back" +
                      "\n\n #. Exit";
                    userResponseTracker.push({
                      ...lastResponse,
                      page: 2,
                      message,
                    });
                    break;
                  case "2": // Main menu
                    message = "Thank you for using our service. Goodbye!";
                    continueSession = false;
                    break;

                  default:
                    message = "Invalid option. Please select 1, 2 or #.";
                }
                break;
            }
            break;

          case 5: // Final level handling
            switch (lastResponse.serviceType) {
              case "MarketPrices":
                switch (userData) {
                  case "1": // Add another crop
                    message =
                      "Select a crop to find their market prices" +
                      "\n1. Maize" +
                      "\n2. Rice" +
                      "\n3. Yam" +
                      "\n4. Beans" +
                      "\n5. Back" +
                      "\n6. Exit";
                    userResponseTracker.push({
                      ...lastResponse,
                      page: 3,
                      message,
                    });
                    break;

                  case "2": // Back to market selection
                    const marketName = markets[lastResponse.marketSelected];
                    const cropName = crops[lastResponse.cropSelected];
                    message =
                      "Select market for " +
                      cropName +
                      ":" +
                      "\n1. Mallam market" +
                      "\n2. Kintampo market" +
                      "\n3. Makola market" +
                      "\n4. Back";
                    userResponseTracker.push({
                      ...lastResponse,
                      page: 6,
                      cropSelected: lastResponse.cropSelected,
                      message,
                    });
                    break;
                  case "3": // Exit
                    message = "Thank you for using our service. Goodbye!";
                    continueSession = false;
                    break;
                }
                break;
              default:
                message = "Invalid option. Please select 1-2.";
            }
            break;

          case 6: // Final level handling
            switch (lastResponse.serviceType) {
              case "MarketPrices":
                switch (userData) {
                  case "1": // Add another crop
                  case "2":
                  case "3":
                    message =
                      "Your request to know the current price of " +
                      crops[lastResponse.cropSelected] +
                      " from " +
                      markets[userData] +
                      " has been received. We will give you the information very soon" +
                      "\n1. Exit";
                    userResponseTracker.push({
                      ...lastResponse,
                      page: 7,
                      message,
                    });
                    break;
                }
                break;
              default:
                message = "Invalid option. Please select 1-2.";
            }
            break;

          case 7: // Final level handling
            switch (lastResponse.serviceType) {
              case "MarketPrices":
                switch (userData) {
                  case "1": // Add another crop
                    message =
                      "Thank you" +
                      userResponseTracker.push({
                        ...lastResponse,
                        page: 8,
                        message,
                      });
                    break;
                }
                break;
            }
            break;
          default:
            message = "An error occurred. Please start over.";
            continueSession = false;
        }
        break;

      case 3: // Add more crops/livestock
        switch (userData) {
          case "1": // Crop
            message = "Thank you";
            continueSession = false;
            break;
        }
        break;
      case 4: // Add Crops/livestock
        switch (lastResponse.page) {
          case 2: // Initial Esoko Services Menu
            switch (userData) {
              case "1": // Market Prices
                message =
                  "Add crops" +
                  "\n1. Maize" +
                  "\n2. Rice" +
                  "\n3. Yam" +
                  "\n4. Beans" +
                  "\n5. Next/More" +
                  "\n6. Exit";
                userResponseTracker.push({
                  ...lastResponse,
                  page: 3,
                  message,
                  type: "crops",
                });
                break;
              case "2": // Weather Info
                message =
                  "Add Livestock" +
                  "\n1. Goat" +
                  "\n2. Cow" +
                  "\n3. Pigs" +
                  "\n4. Sheep" +
                  "\n5. Next/More" +
                  "\n6. Exit";
                userResponseTracker.push({
                  ...lastResponse,
                  page: 3,
                  message,
                  type: "livestock",
                });
                break;
              default:
                message = "Invalid option. Please select 1-6.";
            }
            break;

          case 3: // Crop Selection
            switch (userData) {
              case "1": // Maize
              case "2": // Rice

              case "3": // Yam
              case "4": // Beans
                message =
                  `You selected ${
                    lastResponse.type === "crops"
                      ? crops[userData]
                      : livestocks[userData]
                  }` +
                  "\n1. Confirm and Save" +
                  "\n2. Back" +
                  "\n3. Exit";
                lastResponse.type === "crops"
                  ? (lastResponse.cropSelected = crops[userData])
                  : (lastResponse.livestockSelected = livestocks[userData]);
                userResponseTracker.push({
                  ...lastResponse,
                  page: 4,

                  message,
                });
                break;
            }
          case "4": // Next/More
            switch (userData) {
              case "1":
              case "2":
              case "3":
              case "4":
                message =
                  lastResponse.type === "crops"
                    ? `Congratulations! ${lastResponse.cropSelected} has been added successfully.\n\n1. Add more crops/livestock\n3. Back to main menu\n6. Exit`
                    : lastResponse.type === "livestock"
                    ? `Congratulations! ${lastResponse.livestockSelected} has been added successfully.\n\n1. Add more crops/livestock\n3. Back to main menu\n6. Exit`
                    : "Invalid type.";
                userResponseTracker.push({
                  ...lastResponse,
                  page: 3,
                  message,
                  type: "crops",
                });
                break;
            }
            break;

          default:
            message = "An error occurred. Please start over.";
            continueSession = false;
        }
        break;

      default:
        message = "Something went wrong. Please start over.";
        continueSession = false;
    }

    cache.put(sessionID, userResponseTracker);

    return res.status(200).json({
      userID,
      sessionID,
      message,
      continueSession,
      msisdn,
    });
  } catch (error) {
    console.error("USSD Processing Error:", error);
    return res.status(200).json({
      userID,
      sessionID,
      message: "System error. Please try again.",
      continueSession: false,
      msisdn,
    });
  }
});

app.listen(8000, function () {
  console.log("Arkesel USSD app listening on 8000!");
});
