export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): boolean {
  // Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return passwordRegex.test(password);
}

export function validateUsername(username: string): boolean {
  // Username must be between 3 and 20 characters long and can contain letters, numbers, underscores, and hyphens
  const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
  return usernameRegex.test(username);
}

export function validatePhoneNumber(phone: string): boolean {
  // Phone number must be 10 digits long, start with 9, numbers only
  const phoneRegex = /^9\d{9}$/;
  return phoneRegex.test(phone);
}

export function validateName(name: string): boolean {
  // Name must be between 2 and 50 characters long and can contain letters, spaces, and hyphens
  const nameRegex = /^[a-zA-Z\s-]{2,50}$/;
  return nameRegex.test(name);
}
