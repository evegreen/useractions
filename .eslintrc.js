module.exports = {
  "env": {
    "browser": true,
    "commonjs": true,
    "es6": true,
    "node": true
  },
  "globals": {
    "describe": true,
    "it": true,
    "userActions": true,
    "useractions": true
  },
  "extends": "eslint:recommended",
  "rules": {
    "indent": [ "error", 2 ],
    "linebreak-style": [ "error", "unix" ],
    "quotes": [ "warn", "single" ],
    "semi": [ "error", "always" ],
    "no-unused-vars": [ "error" ],
    "no-console": [ "warn", { allow: ["warn", "error"] } ],
    "no-debugger": [ "error" ]
  }
};
