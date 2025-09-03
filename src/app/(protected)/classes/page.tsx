
import { ClassManagerProvider } from "./class-manager/components/class-manager-provider"

const Page = () => {
    return <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Class Management</h1>
      <ClassManagerProvider />
    </div>
} 

export default Page