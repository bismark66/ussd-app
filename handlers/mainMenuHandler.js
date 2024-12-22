const handleMainMenu = (userData) => {
  let message = "Invalid option. Please select 1-5.";
  let level = 0;
  let page = 1;
  let continueSession = true;

  switch (userData) {
    case "1": // Sign Up
      message =
        "Select Region?" +
        "\n1. Bono West" +
        "\n2. Bono East" +
        "\n3. Bono South" +
        "\n4. Back" +
        "\n\n #. Exit";
      level = 1;
      page = 2;
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
      level = 2;
      page = 2;
      break;

    case "3": // Request Agent
      message =
        "Request Agent" +
        "\n\nWe have received your request." +
        "\nAn agent will call you shortly." +
        "\n\n 1. Exit";
      // userResponseTracker.push({
      //   ...lastResponse,
      nextLevel = 3;
      nextPage = 2;
      // message,
      // });
      break;
    case "4": // Add Crops/Livestock
      message =
        "Select what you want to add" +
        "\n1. Crops" +
        "\n2. Livestock" +
        "\n3. Back" +
        "\n\n*. Exit";
      // userResponseTracker.push({
      //   ...lastResponse,
      nextLevel = 4;
      nextPage = 2; // message,
      // });
      break;

    // ... other cases

    case "5": // Exit
      message = "Thank you for using our service. Goodbye!";
      continueSession = false;
      break;
  }

  return {
    message,
    level,
    page,
    continueSession,
  };
};

module.exports = handleMainMenu;
