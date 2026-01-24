export const FIREBASE_AUTH_ERRORS = {
  INVALID_CREDENTIAL: 'auth/invalid-credential',
  USER_NOT_FOUND: 'auth/user-not-found',
  WRONG_PASSWORD: 'auth/wrong-password',
  USER_DISABLED: 'auth/user-disabled',
  EMAIL_ALREADY_IN_USE: 'auth/email-already-in-use',
  INVALID_EMAIL: 'auth/invalid-email',
  WEAK_PASSWORD: 'auth/weak-password',
  OPERATION_NOT_ALLOWED: 'auth/operation-not-allowed',
  API_KEY_NOT_VALID: 'auth/api-key-not-valid',
  CONFIGURATION_NOT_FOUND: 'auth/configuration-not-found',
  TOO_MANY_REQUESTS: 'auth/too-many-requests',
  NETWORK_REQUEST_FAILED: 'auth/network-request-failed',
  REQUIRES_RECENT_LOGIN: 'auth/requires-recent-login',
  INVALID_ID_TOKEN: 'auth/invalid-id-token',
  ID_TOKEN_EXPIRED: 'auth/id-token-expired',
  POPUP_BLOCKED: 'auth/popup-blocked',
  POPUP_CLOSED_BY_USER: 'auth/popup-closed-by-user',
  UNAUTHORIZED_DOMAIN: 'auth/unauthorized-domain'
}

const ERROR_MESSAGES = {
  en: {
    [FIREBASE_AUTH_ERRORS.INVALID_CREDENTIAL]: 'Invalid email or password. Please check your credentials and try again.',
    [FIREBASE_AUTH_ERRORS.USER_NOT_FOUND]: 'No account found with this email. Please register first.',
    [FIREBASE_AUTH_ERRORS.WRONG_PASSWORD]: 'Incorrect password. Please try again.',
    [FIREBASE_AUTH_ERRORS.EMAIL_ALREADY_IN_USE]: 'An account with this email already exists. Please login instead.',
    [FIREBASE_AUTH_ERRORS.WEAK_PASSWORD]: 'Password is too weak. Please use at least 6 characters.',
    [FIREBASE_AUTH_ERRORS.INVALID_EMAIL]: 'Invalid email address. Please enter a valid email.',
    [FIREBASE_AUTH_ERRORS.OPERATION_NOT_ALLOWED]: 'This operation is not allowed. Please contact support.',
    [FIREBASE_AUTH_ERRORS.TOO_MANY_REQUESTS]: 'Too many failed attempts. Please try again later.',
    [FIREBASE_AUTH_ERRORS.NETWORK_REQUEST_FAILED]: 'Network error. Please check your internet connection.',
    [FIREBASE_AUTH_ERRORS.USER_DISABLED]: 'This account has been disabled. Please contact support.',
    [FIREBASE_AUTH_ERRORS.REQUIRES_RECENT_LOGIN]: 'Please login again to continue.',
    [FIREBASE_AUTH_ERRORS.API_KEY_NOT_VALID]: 'Configuration error. Please contact support.',
    [FIREBASE_AUTH_ERRORS.CONFIGURATION_NOT_FOUND]: 'Authentication not configured. Please contact support.',
    [FIREBASE_AUTH_ERRORS.INVALID_ID_TOKEN]: 'Your session is invalid. Please login again.',
    [FIREBASE_AUTH_ERRORS.ID_TOKEN_EXPIRED]: 'Your session has expired. Please login again.',
    [FIREBASE_AUTH_ERRORS.POPUP_BLOCKED]: 'Popup was blocked by your browser. Please allow popups and try again.',
    [FIREBASE_AUTH_ERRORS.POPUP_CLOSED_BY_USER]: 'Authentication was cancelled. Please try again.',
    [FIREBASE_AUTH_ERRORS.UNAUTHORIZED_DOMAIN]: 'This domain is not authorized for authentication.'
  }
}

export const getFirebaseErrorMessage = (errorCode, locale = 'en') => {
  const messages = ERROR_MESSAGES[locale] || ERROR_MESSAGES.en

  return messages[errorCode] || 'An unexpected error occurred. Please try again.'
}

export const handleFirebaseAuthError = (error, locale = 'en') => {
  const code = error?.code || 'unknown'
  const message = getFirebaseErrorMessage(code, locale)

  return {
    message,
    code,
    originalError: error
  }
}

export const isFirebaseAuthError = (error) => {
  return error?.code?.startsWith('auth/')
}
