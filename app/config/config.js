module.exports = {
  verifyKey: process.env.verifyKey,
  tokenKey: process.env.tokenKey,
  genSalt: Number(process.env.genSalt),

  defaultUsername: process.env.defaultUsername,
  defaultFullname: process.env.defaultFullname,
  defaultPassword: process.env.defaultPassword,
  defaultPhone: process.env.defaultPhone,
  defaultRole: process.env.defaultRole,
};
