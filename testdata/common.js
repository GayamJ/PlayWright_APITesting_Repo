//Utility function to format string with placeholders   
//Example usage: const formattedString = stringformat("Hello {0}, welcome to {1}!", "Alice", "Playwright");
/*
export const stringformat = (str, ...args) => {
  return str.replace(/{(\d+)}/g, (match, index) => {
    return args[index] !== undefined ? args[index] : match;
  });
};
*/


export const stringformat = (str,...args) => {
      return str.replace(/{(\d+)}/g, (match, index) => {
        return args[index] !== undefined ? args[index] : match;
    });
};
