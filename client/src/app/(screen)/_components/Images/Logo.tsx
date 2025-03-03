import React from "react";
import Image from 'next/image';

/**
 * ロゴ（中央揃え）
 * @returns 
 */
const Logo: React.FC = () => {
	return(
		<>
			<div className="flex justify-center">
				<Image
					src="/images/logo.jpg"
					alt="ロゴ"
					width={100}
					height={100}
				/>
			</div>
		</>
	);
}

export default Logo;