// Reference: stackoverflow.com
export function startFrom() {
  return (input, start) => {
    if (input) {
      start = +start; //parse to int
      return input.slice(start);
    }
    return [];
  };
}
