import * as bcrypt from 'bcrypt';


export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, saltRounds);
  return hashed;
};


export const verifyPassword = async (text: string, hash: string) => {
  const done = await bcrypt.compare(text, hash);
  return done;
};
