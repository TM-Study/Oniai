import React from "react";

const PageTitle: React.FC<{pageTitle: string}> = ({pageTitle}) => {

    return(
        <>
        <div className='flex-col font-bold'>
            <div className="m-2 text-center">{pageTitle}</div>
            <div className="mb-2 border-t border-gray-400"></div>
        </div>
        </>
    );
}

export default PageTitle;