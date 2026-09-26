/**
 * Validate standard email pattern
 */
export function validateEmail(email = "") {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

/**
 * Enforce minimum password strength (>= 6 chars)
 */
export function validatePassword(password = "") {
  if (!password || password.length < 6) {
    return {
      isValid: false,
      message: "Password must be at least 6 characters long."
    };
  }
  return { isValid: true, message: "" };
}
