const TOKEN_TYPE = {
  REFRESH: 'refresh',
  RESET_PASSWORD: 'resetPassword',
  ACTIVATE_ACCOUNT: 'activateAccount',
};

const TOKEN_TYPE_VALUES = Object.values(TOKEN_TYPE);

module.exports = {
  TOKEN_TYPE,
  TOKEN_TYPE_VALUES
};
