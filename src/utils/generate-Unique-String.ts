

// import { customAlphabet } from 'nanoid';

// class GenerateUniqueString {
//   static generateUniqueString(length: number = 5) {
//     const nanoid = customAlphabet('12345abcde', length);
//     return nanoid();

//   }
// }

// export default GenerateUniqueString;
class UniqueString {
  constructor() { }

  generateUniqueString(length: number) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    return result;

  }

  generateUniqueCodeForForgetPassword(length: number) {
    const charset = '0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    return result;
  }
}
export default new UniqueString();