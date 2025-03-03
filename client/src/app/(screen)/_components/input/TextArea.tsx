import React from "react";

interface props {
	title: string;
	caption?: string;
	id: string;
	value?: string;
	onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}
  
const TextArea: React.FC<props> = ({ title, caption, id, value, onChange }) => {
	return(
		<>
			<div className="mt-5">

				{/* タイトル */}
				<label htmlFor={id} className="block text-sm/6 font-medium text-gray-900">
					{ title }
					<small>{ caption }</small>
				</label>
			
				{/* テキストエリア */}
				<div className="mt-2">
					<textarea
					id={id}
					name={id}
					value={value || ''}
					onChange={onChange}
					className="w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-400 
					sm:w-full md:w-full lg:w-full
					sm:text-sm/6"
					/>
				</div>
			</div>
		</>
	);
}

export default TextArea;
