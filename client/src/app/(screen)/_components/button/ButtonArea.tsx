import React from "react";

interface props {
	text: string;
	disabled: boolean;
	errorMsg?: string;
}

const ButtonArea: React.FC<props> = ({text, disabled, errorMsg}) => (
	<>
	<div className="mt-10">
		
		{/* ボタン */}
		<button
			type="submit"
			disabled={disabled}
			className="flex w-full justify-center rounded-md px-3 py-1.5 text-sm/6 font-semibold text-black shadow-sm border border-black hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
			>
			{disabled ? text + '中...' : text}
		</button>

		{/* エラーメッセージ */}
		{errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
	</div>
	</>
)

export default ButtonArea;