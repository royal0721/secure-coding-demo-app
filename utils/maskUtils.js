const maskUsername = (username) => {
  if (!username) return "***"; // 處理空值情況

  if (username.includes("@")) {
    const [name, domain] = username.split("@");
    return `${name[0]}***@${domain}`;
  }
  return `${username.slice(0, 3)}***`;
};

module.exports = { maskUsername };
