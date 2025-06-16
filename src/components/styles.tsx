import { ReactNode } from "react";

export const PageContainer = ({children}: {children: ReactNode}) => <div className="flex flex-col gap-4 bg-white w-full">{children}</div>   
export const PageTitle = ({children}: {children: ReactNode}) => <div className=" font-bold text-4xl border-b-2 border-neutral-200 mb-4 pb-2">{children}</div>
export const Breadcrumb = ({children}: {children: ReactNode}) => <div className="text-sm text-slate-700 cursor-pointer hover:underline">{children}</div>  