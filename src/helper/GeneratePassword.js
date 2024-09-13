export function generatePassword () {
    const capitalLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const smallLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '0123456789';
  
    let password = '';
  
    // Generate at least one character from each category
    password += getRandomCharacter (capitalLetters);
    password += getRandomCharacter (smallLetters);
    password += getRandomCharacter (numbers);
    password += getRandomCharacter (symbols);
  
    // Generate the remaining characters randomly
    for (let i = 4; i < 8; i++) {
      const characterType = getRandomInt (4); // 0: capital letter, 1: small letter, 2: number, 3: symbol
  
      switch (characterType) {
        case 0:
          password += getRandomCharacter (capitalLetters);
          break;
        case 1:
          password += getRandomCharacter (smallLetters);
          break;
        case 2:
          password += getRandomCharacter (numbers);
          break;
        case 3:
          password += getRandomCharacter (symbols);
          break;
      }
    }
  
    return password;
  }
  
  function getRandomCharacter (characterSet) {
    const randomIndex = getRandomInt (characterSet.length);
    return characterSet.charAt (randomIndex);
  }
  
  function getRandomInt (max) {
    return Math.floor (Math.random () * Math.floor (max));
  }
  