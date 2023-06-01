import { ref } from 'vue'
import { auth } from '../firebaseConfig';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useFirestore } from './useFirestore';
import { useVuelidate } from '@vuelidate/core'
import { required, helpers, minLength, maxLength } from '@vuelidate/validators'

// const rules = ref();

export function useValidator() {

    function nameRule() {
        const rule = {
            required,
            maxLength: helpers.withMessage(
                'The name value must be 50 characters or less.',
                minLength(50)
            )
        }
        return rule;
    }


    return { nameRule }
}
