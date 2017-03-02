export function getCurrentMonth() {
  let month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  let d = new Date();
  return month[d.getMonth()];
}

export function getCurrentDay() {
  let month = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  let d = new Date();
  return month[d.getDay()-1];
}