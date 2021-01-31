// Add ordinal (st, nd, th etc) to the number
export function numToOrd(value) {
  var s = String(value),
    len = s.length,
    end = s.substr(len - 1, 1),
    teen = len > 1 && s.substr(len - 2, 1) === "1",
    ord = "th";
  if (end === "1" && !teen) {
    ord = "st";
  } else if (end === "2" && !teen) {
    ord = "nd";
  } else if (end === "3" && !teen) {
    ord = "rd";
  }
  return `${value}${ord}`;
}
