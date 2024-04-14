function shortenText(text, maxLength) {
  if (text.length <= maxLength) {
    return text;
  } else {
    return (
      text.substr(0, maxLength / 2) +
      "..." +
      text.substr(text.length - maxLength / 2)
    );
  }
}
export { shortenText };
