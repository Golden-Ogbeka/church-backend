export interface DevotionalType {
  date: any
  title: string
  text: string
  mainText: string
  content: string
  confession: string
  furtherReading: string[]
  oneYearBibleReading: string[]
  twoYearsBibleReading: string[]
  createdBy: string
  updatedBy: string
  views: number
  _id: string
}

export type UncertainObjectType = {
  [key: string]: any
}

export interface EventType {
  name: string
  theme: string
  mainText: string
  date: Date
  time: string
  allowRegistration: boolean
  registrationEntries: any[]
  gallery: string[]
  limitedNumberRegistration: boolean
  registrationNumberLimit: number
  limitedDateRegistration: boolean
  registrationDateLimit: Date
  requiredRegistrationDetails: any
  poster: string
  eventType: string
  location: string
  description: string
  createdBy: string
  updatedBy: string
  _id: string
}

export interface TestimonyType {
  email: string
  phoneNumber: string
  fullName: string
  summary: string
  content: string
  status: string
  source: string
  updatedBy: string
  _id: string
}

export interface AdminType {
  fullname: string
  email: string
  avatar: string
  role: string
  password: string
  active: boolean
  verificationCode: string
  createdBy: string
  updatedBy: string
  _id: string
}

export interface RegistrationDetailType {
  id?: string
  name: string
  type: string
  options?: string
}

export interface FeedbackType {
  fullName: string
  email: string
  phoneNumber: string
  content: string
  status: string
  updatedBy: string
  source: string
}

export interface UserType {
  firstName: string
  lastName: string
  email: string
  password: string
  phoneNumber: string
  verificationCode: string
  _id: string
  dateOfBirth: string
  churchCenter: string
  member: boolean
}

export interface AnnouncementType {
  title: string
  details: string
  image: string
  createdBy: string
  priority: number
  updatedBy: string
  _id: string
}

export interface TFCCType {
  address: string
  cellLeader: string
  phoneNumber: string
  zone: string
  createdBy: string
  _id: string
  updatedBy: string
}
export interface TFCCZoneType {
  name: string
  createdBy: string
  _id: string
  updatedBy: string
}
