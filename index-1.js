const express = require("express");
const cache = require("memory-cache");
const bodyParser = require("body-parser");
const cors = require("cors");
const handleMainMenu = require("./handlers/mainMenuHandler");
const handleSignup = require("./handlers/signupHandler");
const handleEsokoServices = require("./handlers/servicesHandler");
const { serviceTypes } = require("./config/constants");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.options("*", cors());
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

  try {
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
    let response;

    switch (lastResponse.level) {
      case 0: // Main Menu
        response = handleMainMenu(userData, lastResponse);
        // if (userData === "1") {
        //   // Sign Up selected
        //   response = {
        //     message:
        //       "Select Region?" +
        //       "\n1. Bono West" +
        //       "\n2. Bono East" +
        //       "\n3. Bono South" +
        //       "\n4. Back" +
        //       "\n\n#. Exit",
        //     level: 1,
        //     page: 2,
        //     continueSession: true,
        //   };
        // } else {
        //   // Handle other main menu options...
        //   response = {
        //     message: "Option not implemented",
        //     level: 0,
        //     page: 1,
        //     continueSession: true,
        //   };
        // }
        break;

      case 1: // Sign Up Flow
        response = handleSignup(userData, lastResponse);
        break;

      case 2: // Esoko Services Flow
        response = handleEsokoServices(
          userData,
          lastResponse.page,
          serviceTypes[userData],
          lastResponse
        );
        break;

      default:
        response = {
          message: "Something went wrong. Please start over.",
          continueSession: false,
        };
    }

    if (response.continueSession) {
      userResponseTracker.push({
        ...lastResponse,
        ...response,
      });
      cache.put(sessionID, userResponseTracker);
    }

    return res.status(200).json({
      userID,
      sessionID,
      message: response.message,
      continueSession: response.continueSession,
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

app.listen(8000, () => {
  console.log("Arkesel USSD app listening on 8000!");
});
