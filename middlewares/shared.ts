import { ObjectId } from 'mongodb';
export const isValidAPI = async (value: string) => {
  const API_KEY = process.env.API_KEY
  if (API_KEY !== value) {
    throw new Error("Invalid API key")
  }

  return true
};

export const isValidObjectId = (id: string) => {
  if (!ObjectId.isValid(id)) {
    throw new Error("Invalid ID")
  }
  return true

}

