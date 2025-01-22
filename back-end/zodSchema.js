const zod = require("zod");

const signupSchema = zod.object({
    name: zod.string(),
    email: zod.string(),
    password: zod.string(),
    mobile: zod.number(),
    address: zod.string(),
    city: zod.string(),
    state: zod.string(),
    });
    

  module.exports = {
    signupSchema,
  }