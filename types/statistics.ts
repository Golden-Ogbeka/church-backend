export interface GeneralSummaryType {
  totalUsers: number
  unreadFeedback: number
  upcomingEvents: number
  totalAnnouncements: number
  pendingTestimonies: number
  totalAdmins: number
  totalDevotionals: number
}

export interface UserSummaryType {
  totalUsers: number
  userRegisteredByMobile: number
  userRegisteredByWeb: number
  registeredMembers: number
}

export interface FeedbackSummaryType {
  feedbackSentByWeb: number
  feedbackSentByMobile: number
  totalFeedback: number
  unreadFeedback: number
}

export interface TestimonySummaryType {
  testimonySentByMobile: number
  testimonySentByWeb: number
  totalTestimonies: number
  pendingTestimonies: number
}
