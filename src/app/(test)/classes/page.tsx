import { getGroups } from "@/actions/groups-memberships/getGroups";
import { GroupProfileManager } from "./components/group-profile-manager";


const Page = async () => {

    const {data: groups, error: groupsError} = await getGroups();
    
    if (!groups || groupsError != null) {
        return <div>Error! {groupsError}</div>
    }

    

    return <div>
        <GroupProfileManager initialGroups={groups}/>
        <pre>{JSON.stringify(groups, null, 2)}</pre>
        </div>
}

export default Page;