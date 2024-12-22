const {
  crops,
  livestocks,
  regions,
  farmerTypes,
} = require("../config/constants");

const handleSignup = (userData, lastResponse) => {
  let message = "Invalid option.";
  let nextLevel = lastResponse.level;
  let nextPage = lastResponse.page;
  let continueSession = true;
  let additionalData = {};

  switch (lastResponse.page) {
    // case 1:
    case 2: // Region Selection Page
      // case 3: // Crop Selection Page
      // case 4: // Livestock Selection Page
      console.log("userData", userData);
      console.log([1, "2", "3"].includes(userData));
      if (["1", "2", "3"].includes(userData)) {
        // User selected a valid region
        message =
          "Hello Kofi Annan, would you like to activate an esoko account? " +
          "This gives you access to all our services. To learn more about Esoko call 1900 toll free" +
          "\n1. Activate" +
          "\n2. Back" +
          "\n3. Exit";
        nextPage = 3;
        additionalData.selectedRegion = regions[userData];
      } else if (userData === "4") {
        // Back to main menu
        message =
          "Welcome to Esoko DigMKT Services." +
          "\n1. Sign Up" +
          "\n2. Esoko Service" +
          "\n3. Request Agent" +
          "\n4. Add Crops/Livestock" +
          "\n5. Exit";
        nextLevel = 1;
        nextPage = 3;
      } else if (userData === "#") {
        message = "Thank you for using our service. Goodbye!";
        continueSession = false;
      } else {
        message = "Invalid option. Please select 1-4 or # to exit.";
        // Keep the same page and level
      }
      break;

    case 3: // Account Activation Page
      switch (userData) {
        case "1": // Activate
          console.log("entered here");
          message =
            "What type of farmer are you?" +
            "\n1. Crop Farmer" +
            "\n2. Livestock Farmer" +
            "\n#. Exit";
          nextPage = 4;
          //   additionalData.selectedFarmer = farmerTypes[userData];
          break;

        case "2": // Back to Region Selection
          message =
            "Select Region?" +
            "\n1. Bono West" +
            "\n2. Bono East" +
            "\n3. Bono South" +
            "\n4. Back" +
            "\n\n#. Exit";
          nextPage = 2;
          break;

        case "3": // Exit
          message = "Thank you for using our service. Goodbye!";
          continueSession = false;
          break;

        default:
          message = "Invalid option. Please select 1-3.";
        // Keep the same page and level
      }
      break;

    case 4: // Farmer Type Selection Page
      switch (userData) {
        case "1": // Crop Farmer
          message =
            "Add crops" +
            "\n1. Maize" +
            "\n2. Rice" +
            "\n3. Yam" +
            "\n4. Beans" +
            "\n5. Back" +
            "\n#. Exit";
          nextPage = 5;
          additionalData.farmerType = "crops";
          break;

        case "2": // Livestock Farmer
          message =
            "Add livestock" +
            "\n1. Cows" +
            "\n2. Goats" +
            "\n3. Pigs" +
            "\n4. Sheep" +
            "\n5. Back" +
            "\n#. Exit";
          nextPage = 5;
          additionalData.farmerType = "livestock";
          break;

        case "#":
          message = "Thank you for using our service. Goodbye!";
          continueSession = false;
          break;

        default:
          message = "Invalid option. Please select 1-2 or # to exit.";
        // Keep the same page and level
      }
      break;

    case 5: // Product Selection Page
      console.log("you have reached here", userData);
      const productList =
        lastResponse.farmerType === "crops" ? crops : livestocks;

      if (["1", "2", "3", "4"].includes(userData)) {
        const product = productList[userData];
        message =
          `You have selected ${product}.\n\n` +
          "1. Confirm and Save\n" +
          "2. Back to main menu\n" +
          "3. Exit";
        nextPage = 6;
        additionalData.selectedProduct = product;
      } else if (userData === "5") {
        // Back to farmer type selection
        message =
          "What type of farmer are you?" +
          "\n1. Crop Farmer" +
          "\n2. Livestock Farmer" +
          "\n#. Exit";
        nextPage = 4;
      } else if (userData === "#") {
        message = "Thank you for using our service. Goodbye!";
        continueSession = false;
      } else {
        message = "Invalid option. Please select 1-5 or # to exit.";
        // Keep the same page and level
      }
      break;

    case 6: // Confirmation Page
      switch (userData) {
        case "1": // Confirm and Save
          message =
            `Congratulations! ${lastResponse.selectedProduct} has been added successfully.\n\n` +
            "1. Add more products\n" +
            "2. Back to main menu\n" +
            "3. Exit";
          nextPage = 7;
          break;

        case "2": // Back to Main Menu
          message =
            "Welcome to Esoko DigMKT Services." +
            "\n1. Sign Up" +
            "\n2. Esoko Service" +
            "\n3. Request Agent" +
            "\n4. Add Crops/Livestock" +
            "\n5. Exit";
          nextLevel = 0;
          nextPage = 1;
          break;

        case "3": // Exit
          message = "Thank you for using our service. Goodbye!";
          continueSession = false;
          break;

        default:
          message = "Invalid option. Please select 1-3.";
        // Keep the same page and level
      }
      break;

    case 7: // Post-Confirmation Page
      switch (userData) {
        case "1": // Add more products
          message =
            lastResponse.farmerType === "crops"
              ? "Add crops" +
                "\n1. Maize" +
                "\n2. Rice" +
                "\n3. Yam" +
                "\n4. Beans" +
                "\n5. Back" +
                "\n#. Exit"
              : "Add livestock" +
                "\n1. Cows" +
                "\n2. Goats" +
                "\n3. Pigs" +
                "\n4. Sheep" +
                "\n5. Back" +
                "\n#. Exit";
          nextPage = 5;
          break;

        case "2": // Back to Main Menu
          message =
            "Welcome to Esoko DigMKT Services." +
            "\n1. Sign Up" +
            "\n2. Esoko Service" +
            "\n3. Request Agent" +
            "\n4. Add Crops/Livestock" +
            "\n5. Exit";
          nextLevel = 0;
          nextPage = 1;
          break;

        case "3": // Exit
          message = "Thank you for using our service. Goodbye!";
          continueSession = false;
          break;

        default:
          message = "Invalid option. Please select 1-3.";
        // Keep the same page and level
      }
      break;
  }

  return {
    message,
    level: nextLevel,
    page: nextPage,
    continueSession,
    ...additionalData,
  };
};
module.exports = handleSignup;
