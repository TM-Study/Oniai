import React from "react";

interface props {
	title: string;
	caption?: string;
	id: string;
	type: string;
	value?: string | number;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const TextInputArea: React.FC<props> = ({ title, caption, id, type, value, onChange }) => (
	<>
	<div className="mt-5">
		
		{/* タイトルラベル */}
		<label htmlFor={id} className="block text-sm/6 font-medium text-gray-900">
			{ title }
			<small>{ caption }</small>
		</label>

		{/* インプットボックス */}
		<div className="mt-2">
			<input
			id={id}
			name={id}
			type={type}
			value={value || undefined}
			onChange={onChange}
			required
			autoComplete={type}
			className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-400 sm:text-sm/6"
			/>
		</div>
	</div>
	</>
);

export default TextInputArea;
