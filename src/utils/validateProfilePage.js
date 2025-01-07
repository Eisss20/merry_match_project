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

  // ตรวจสอบว่าปีปัจจุบันมากกว่าปีเกิดอย่างน้อย 18 ปี
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

export const validateHobbies = (hobbies) => {
  if (!hobbies || hobbies.length === 0) {
    return "Please select hobbies / interests";
  }
  return "";
};

export const validateAboutme = (value) => {
  if (!value) {
    return "Please fill in aboutme";
  }
  if (value.length > 150) {
    return "The information exceeds 150 characters";
  }
  return "";
};

export const validateProfilePicture = (avatar) => {
  if (!avatar || Object.keys(avatar).length < 2) {
    return "Upload at least 2 photos";
  }
  return "";
};

export const validateRequiredFieldsProfilePage = ({
  name,
  date,
  hobbies,
  value,
  // fields,
}) => {
  const requiredFieldPicture = ["avatar"];

  for (let field of requiredFieldPicture) {
    if (
      !name ||
      !date ||
      (Array.isArray(hobbies) && hobbies.length === 0) ||
      !value ||
      (typeof value === "string" && value.trim() === "") // ||
      // !fields[field] ||
      // (Array.isArray(fields[field]) && fields[field].length === 0) ||
      // (typeof fields[field] === "object" && fields[field] === null)
    ) {
      return "Please fill in all the required information";
    }
  }

  return "";
};
