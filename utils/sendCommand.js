import readline from "readline";

// Create a readline interface to read user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Create a function to ask for user input
export const sendTerminalCommand = () => {
  rl.question("Enter your Chat prompt: ", (input) => {
    if (
      input.toLocaleLowerCase() === "exit" ||
      input.toLocaleLowerCase() === "quit"
    ) {
      console.log("Exiting...");
      rl.close();
    } else {
      // chatCompletion(input).then(() => getPrompt());
      // Call getPrompt again to ask for the next input
    }
  });
};
