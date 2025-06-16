import Image from "next/image";
import Link from "next/link";
import Hero from "@/images/homepage.png";

export default function Home() {
  return (
    <div className="flex flex-row items-center justify-center h-screen w-screen   font-sans">
      <div className="flex flex-col gap-5 m-8">
        <div className="text-6xl">Course Planner</div>
        <Link className="text-xl" href="./course">
          Build and manage your courses
        </Link>
      </div>
      <Image src={Hero} alt="logo" width={600} height={400}/>
    </div> 

  );
}
