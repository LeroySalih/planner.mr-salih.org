import { getProfile } from "@/actions/profiles/getProfile";
import { useEmailLink } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import DisplayProfile from "./display-profile";

const Page = async () => {
    
    const {userId} = await auth();

    const {data: profile, error} = userId ? await getProfile(userId) : {data: null, error: "no profile found"};

    if (error) {
        return <div className="flex flex-col items-center justify-center w-full h-screen bg-white-100 p-8 text-3xl">
            <p>Error: {error}</p>
        </div>;
    }


    return <div className="flex flex-col w-full h-screen bg-white-100 p-8 text-3xl">
        Profile
        <div>
            <pre>{JSON.stringify(profile, null, 2)}</pre>
        </div>

        <DisplayProfile userId={userId} />

    </div>
}


export default Page;