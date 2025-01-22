const signupSchema = z.object({
    name: z.string(),
    email: z.string(),
    password: z.string(),
    mobile: z.number(),
    address: z.string(),
    city: z.string(),
    state: z.string(),
    });

  module.exports = {
    signupSchema,
  }