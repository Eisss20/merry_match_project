
export const validateName = (name) => {
  const regex = /^[A-Za-z]+$/; 
  if (!regex.test(name)) {
    return "Name must be in English only"; 
  }
  if (name[0] !== name[0].toUpperCase()) {
    return "The first letter must be capitalized"; 
  }
  if (name.length >= 20) {
    return "Your name exceeds the 20-character limit"; 
  }
  return null; 
};


export const validateAge = (date) => {
  if (!date) {
    return "Please select your date of birth"; 
  }

  const today = new Date();
  const birthDate = new Date(date);
  const age = today.getFullYear() - birthDate.getFullYear();

  
  const hasBirthdayPassedThisYear =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() >= birthDate.getDate());

  const isOldEnough = age > 18 || (age === 18 && hasBirthdayPassedThisYear);

  if (!isOldEnough) {
    return "You must be over 18 years old";
  }

  return ""; 
};

export const validateLocation = (location) => {
  if (!location) {
    return "Please select Location";
  }
  return "";
};

export const validateCity = (city) => {
  if (!city) {
    return "Please select City";
  }
  return ""; 
};

export const validateUsername = async (username) => {
  if (!username) {
    return "Please enter your username"; 
  }

  const response = await fetch("/api/auth/check-username", {
    method: "POST",
    body: JSON.stringify({ username }),
    headers: { "Content-Type": "application/json" },
  });

  const result = await response.json();

  if (result.exists) {
    return "Username is already taken";
  }

  return ""; 
};


export const validateEmail = async (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const trimmedEmail = email.trim(); 

  if (!trimmedEmail) {
    return "Please enter your email"; 
  }

  const response = await fetch("/api/auth/check-email", {
    method: "POST",
    body: JSON.stringify({ email }),
    headers: { "Content-Type": "application/json" },
  });

  const result = await response.json();

  if (result.exists) {
    return "Email is already registered";
  }

  
  if (!trimmedEmail.includes("@")) {
    return "The email address is invalid"; 
  }

  if (!emailRegex.test(trimmedEmail)) {
    return "The email format is incorrect. Please ensure it follows the format example@example.com"; 
  }

  return ""; 
};

export const validatePassword = (password) => {
  const lowerCaseRegex = /[a-z]/; 
  const upperCaseRegex = /[A-Z]/; 
  const numberRegex = /[0-9]/; 


  if (password.length < 8) {
    return "Your password must be at least 8 characters long"; 
  }
  if (!lowerCaseRegex.test(password)) {
    return "The password must contain lowercase letters"; 
  }
  if (!upperCaseRegex.test(password)) {
    return "The password must contain at least one uppercase letter"; 
  }
  if (!numberRegex.test(password)) {
    return "The password must contain at least one number"; 
  }
  return ""; 
};

export const validateConfirmPassword = (password, confirm) => {
  if (!confirm) {
    return "Please enter your ConfirmPassword"; 
  }
  if (confirm !== password) {
    return "The password and confirm password do not match"; 
  }
  return ""; 
};

export const validateRequiredFieldsStep1 = ({
  name,
  date,
  selectedLocation,
  citys,
  username,
  email,
  password,
  confirm,
}) => {
  if (
    !name ||
    !date ||
    !selectedLocation ||
    !citys ||
    !username ||
    !email ||
    !password ||
    !confirm
  ) {
    return "Please fill in all the required information";
  }
  return "";
};
