import React from "react";

interface props {
	text: string;
	href: string;
}

const Link: React.FC<props> = ({text, href}) => (
	<>
		<div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm flex justify-center">
			<a href={href} className="font-semibold text-indigo-600 hover:text-indigo-500 underline text-center">
				{text}
			</a>
		</div>
	</>
)

export default Link;