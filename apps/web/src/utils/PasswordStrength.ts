const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.match(/[a-z]+/)) {
      strength += 25;
    }
    if (password.match(/[A-Z]+/)) {
      strength += 25;
    }
    if (password.match(/[0-9]+/)) {
      strength += 25;
    }
    if (password.length >= 8) {
      strength += 25;
    }
    return strength;
  };
  
export {calculatePasswordStrength}