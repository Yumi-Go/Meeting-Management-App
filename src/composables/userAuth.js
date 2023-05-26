import { auth } from './firebaseConfig';
import { createUserWithEmailAndPassword } from '@firebase/auth';

export default {
  async signupWithEmail(data) {
    console.log('UserService.signupWithEmail()');
    createUserWithEmailAndPassword(auth, data.email, data.password)
      .then((credential) => {
        const user = credential.user;
        console.log(user);
      })
      .catch((error) => {
        console.error('Error ', error.message);
      });
  }
};