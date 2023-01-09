export const isValidAPI = async (value: string) => {
  const API_KEY = process.env.API_KEY
  if (API_KEY !== value) {
    throw new Error("Invalid API key")
  }

  return true

  // const token = value.split(' ')[1];
  // const tokenData = jwt.verify(token, process.env.SECRET);
  // if (!tokenData) throw new Error(tokenData);

  // const isAdmin = await Admin.findOne({
  //   where: { email: tokenData.email },
  // });
  // if (!isAdmin) throw new Error('Unauthorized!');

  // return true;

};

