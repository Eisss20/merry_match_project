export const validateProfilePicture = (avatar) => {
 
  if (!avatar || Object.keys(avatar).length < 2) {
    return "Upload at least 2 photos"; 
  }
  return ""; 
};

export const validateRequiredFieldsStep3 = (fields) => {
  const requiredFieldsStep3 = [
    "avatar", 
  ];

  for (let field of requiredFieldsStep3) {
   
    if (
      !fields[field] ||
      (Array.isArray(fields[field]) && fields[field].length === 0) ||
      (typeof fields[field] === "object" && fields[field] === null)
    ) {
      return `Please select a profile picture`; 
    }
  }

  return null; 
};
