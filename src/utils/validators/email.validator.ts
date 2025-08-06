const emailValidator = async (email: string) => {
  const regexValidator = /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gm;

  const check = regexValidator.test(email);

  return check;
};

export default emailValidator;
