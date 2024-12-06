import { Command } from "commander";
import inquirer from "inquirer";
import { sendVerificationCode, verifyCode } from "./api/auth";
import { JsonDatabase } from "./store";
import { fetchMenuItems, fetchRestaurantVendors } from "./api/search";

const program = new Command();
const store = new JsonDatabase();

program.name("barista").description("CLI for coffee ordering").version("1.0.0");

program
  .command("login")
  .description("Login to the app")
  .action(async () => {
    if (store.getAuthToken()) {
      // tell the user they are already logged in
      console.log("You are already logged in!");
    }
    const { phoneNumber } = await inquirer.prompt([
      {
        type: "input",
        name: "phoneNumber",
        message: "Enter your phone number:",
        validate: (value) => {
          // TODO: Do some validation here
          return true;
        },
      },
    ]);
    sendVerificationCode(phoneNumber);

    console.log("Sending verification code...");

    const { verificationCode } = await inquirer.prompt([
      {
        type: "input",
        name: "verificationCode",
        message: "Enter verification code:",
      },
    ]);
    const res = await verifyCode(phoneNumber, verificationCode);
    store.setAuthToken(res.nested_jwt);
    store.addAddress(res.user.addresses[0]);
    store.addAddress(res.user.addresses[0]);
  });

program
  .command("order")
  .description("Order a coffee")
  .action(async () => {
    if (!store.getAuthToken()) {
      console.error("You need to be logged in to order a coffee");
      console.log("Please run `barista login` to log in.");
      return;
    }
    if (!store.getAddresses().length) {
      console.error("You need to add an address to order a coffee");
      console.log("Please run `barista add` to add an address.");
      return;
    }
    const token = store.getAuthToken();
    const addresses = store.getAddresses();

    const vendors = await fetchRestaurantVendors(token, addresses[0]);

    const vendorsShortList = vendors.finalResult.slice(0, 5);

    const { cafe } = await inquirer.prompt([
      {
        type: "list",
        name: "cafe",
        message: "Select a cafe:",
        choices: vendorsShortList.map((vendor) => ({
          name: vendor.data.title,
          value: vendor.data.id,
        })),
      },
    ]);

    const selectedCafe = vendorsShortList.find(
      (vendor) => vendor.data.id === cafe
    );

    console.log(`Selected vendor ID: ${selectedCafe?.data.title}`);

    const menuItems = await fetchMenuItems(
      token,
      Number(selectedCafe?.data.lat),
      Number(selectedCafe?.data.lon)
    );
    console.log("Menu items:", menuItems);

    const { selectedCoffee } = await inquirer.prompt([
      {
        type: "list",
        name: "selectedCoffee",
        message: "Select your coffee:",
        choices: menuItems.menuCategories.map((item) => ({
          name: item.title,
          value: item.id,
        })),
      },
    ]);

    console.log(`Ordering: ${cafe} - ${selectedCoffee}`);

    const { confirm } = await inquirer.prompt([
      {
        type: "confirm",
        name: "confirm",
        message: "Confirm your order?",
        default: true,
      },
    ]);

    if (confirm) {
      console.log("Order confirmed!");
    } else {
      console.log("Order cancelled.");
    }
  });

program
  .command("ls")
  .description("List available drinks")
  .action(() => {
    console.log("Available drinks:");
    console.log("- Espresso");
    console.log("- Latte");
    console.log("- Cappuccino");
  });

program
  .command("help")
  .description("Show help information")
  .action(() => {
    console.log("Barista CLI Help:");
    console.log("  barista order - Place a coffee order");
    console.log("  barista ls    - List available drinks");
    console.log("  barista help  - Show this help");
  });

program.parse(process.argv);
