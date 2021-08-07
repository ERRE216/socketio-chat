const utils = {};

utils.cookieFormater = cookies => {
  const str = cookies.split('; ');
  const result = {};
  for (i in str) {
    let current = str[i].split('=');
    result[current[0]] = current[1];
  }
  return result;
};
utils.formatMessage = (user, text) => {
  return {
    user,
    text,
    time: `"${new Date().toLocaleTimeString('CDT')}"`
  };
};

module.exports = utils;
