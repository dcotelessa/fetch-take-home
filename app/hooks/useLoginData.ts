import { useReducer, useState } from 'react';
import { z } from 'zod';

interface FormData {
	name: string;
	email: string;
}

interface FormErrors {
	name: string;
	email: string;
}

interface FormAction {
	type: 'UPDATE_INPUT';
	payload: { name: keyof FormData; value: string };
}

const loginSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	email: z.string().email('Invalid email address'),
});

const initialState: FormData = {
	name: '',
	email: '',
};

const initialErrors: FormErrors = {
	name: '',
	email: '',
};

const formReducer = (state: FormData, action: FormAction): FormData => {
	switch (action.type) {
		case 'UPDATE_INPUT':
			return { ...state, [action.payload.name]: action.payload.value };
		default:
			return state;
	}
};

const useFormData = () => {
	const [formData, dispatch] = useReducer(formReducer, initialState);
	const [errors, setErrors] = useState<FormErrors>(initialErrors);

	const validateInputs = async () => {
		try {
			const validationResult = loginSchema.safeParse(formData);
			if (!validationResult.success) {
				const issues = validationResult.error.issues;
				const errorMessages: { [key: string]: string } = {};

				issues.forEach((issue) => {
					errorMessages[issue.path[0]] = issue.message;
				});

				Object.keys(loginSchema.shape).forEach((key) => {
					if (!errorMessages[key]) {
						setErrors((prevErrors) => ({ ...prevErrors, [key]: '' }));
					} else {
						setErrors((prevErrors) => ({ ...prevErrors, [key]: errorMessages[key] }));
					}
				});
			} else {
				setErrors(initialErrors);
			}
		} catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
			// these are weird errors
			console.error(error);
		}
	};


	const updateInput = (name: keyof FormData, value: string) => {
		dispatch({ type: 'UPDATE_INPUT', payload: { name, value } });
	};

const hasErrors = Object.keys(errors).some((key) => errors[key as keyof FormErrors] !== '');

	return { formData, updateInput, validateInputs, hasErrors, errors };
};

export default useFormData;
