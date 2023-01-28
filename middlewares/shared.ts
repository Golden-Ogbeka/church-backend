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
export const isValidSource = (source: string) => {
  if (!(['web', 'mobile'].includes(source))) {
    throw new Error("Source should be either web or mobile")
  }
  return true
}

export const isValidStatus = (status: string) => {
  if (!['pending', 'approved', 'declined', 'archived'].includes(status)) {
    throw new Error(
      'Status should be either pending, approved, declined, archived'
    )
  }
  return true
}

