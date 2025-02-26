import React from 'react';

interface TextInputProps {
	label: string;
	value: string;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	error?: string;
}

const TextInput: React.FC<TextInputProps> = ({
	label,
	value,
	onChange,
	error,
}) => {
	return (
		<label>
			{label}:
			<input
				type="text"
				value={value}
				onChange={onChange}
				className={error ? 'error' : ''}
			/>
			{error && <div className="alert">{error}</div>}
		</label>
	);
};

export default TextInput;
