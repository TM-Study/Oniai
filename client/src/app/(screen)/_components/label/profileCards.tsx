import React from "react";
import Link from "next/link";
import { UserCircleIcon } from '@heroicons/react/24/solid';

import { ProfileDTO } from "@/types/profileDTO";


const ProfileCards: React.FC<{profiles: ProfileDTO[] | null}> = ({profiles}) => {

    return(
        <>
        {profiles?.filter(profile => profile?.id).map((profile: ProfileDTO) => (
            <Link key = {profile?.id} href = {{pathname: 'profile-details', query: {id: btoa(profile!.userId!.toString())}}} className="group">
                {profile?.image ? (
                    <img
                    src={`data:image/jpeg;base64,${profile.image}`}
                    alt=""
                    className="aspect-square w-40 h-40 rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-[7/8]"
                    />
                ) : (
                    <UserCircleIcon className='w-40 h-40'/>
                )}
                <h3 className="mt-4 text-lg font-medium text-gray-700">{profile?.name}</h3>
                <p className="mt-1 text-sm text-gray-900">{profile?.age}歳　{profile?.residence}</p>
            </Link>
        ))}
        </>
    );
}

export default ProfileCards;