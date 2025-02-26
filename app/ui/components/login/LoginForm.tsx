'use client'
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import useFormData from '@/app/hooks/useLoginData';
import TextInput from '../TextInput';
import LoadingIcon from '../icons/LoadingIcon';

const LoginForm = () => {
	const fetchUrl = process.env.NEXT_PUBLIC_FETCH_URL || ''
	const router = useRouter();
	const searchParams = useSearchParams();
	const params = new URLSearchParams(searchParams.toString());
	const { formData, updateInput, hasErrors, errors, validateInputs } = useFormData();
	const [error, setError] = useState<null | string>(null);
	const [loggingIn, setLoggingIn] = useState<boolean>(false);

	useEffect(() => {
		if (error === null) {
			setError('');
			return;
		}
		validateInputs();
	}, [formData.name, formData.email]);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		setLoggingIn(true);
		event.preventDefault();
		setError('');
		await validateInputs();

		try {
			if (hasErrors) {
				throw new Error('Please correct validation errors.');
			}

			const response: Response = await fetch(`${fetchUrl}/auth/login`, {
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
				},
				mode: 'cors',
				body: JSON.stringify(formData),
			});

			if (!response.ok) {
				throw new Error('LOGIN ERROR: Login failed');
			}

			router.push(`/?${params.toString()}`);
		} catch (error: any) {
			setError(error.message);
			setLoggingIn(false);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<TextInput
				label="Name"
				value={formData.name}
				onChange={(event) => updateInput('name', event.target.value)}
				error={errors.name}
			/>
			<br />
			<TextInput
				label="Email"
				value={formData.email}
				onChange={(event) => updateInput('email', event.target.value)}
				error={errors.email}
			/>
			<br />
			{error && <div className="error">{error}</div>}
			{loggingIn && <LoadingIcon />}
			{!loggingIn && <button type="submit">Login</button>}
		</form>
	);
};

export default LoginForm;

