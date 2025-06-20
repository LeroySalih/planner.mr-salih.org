import React, { ReactNode } from "react";


import {
    SignedIn,
    SignedOut,
    SignInButton,
} from "@clerk/nextjs";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
    return (
        <section>
            <SignedIn>
            {children}
            </SignedIn>
            <SignedOut>
                <div className="flex flex-col items-center justify-center h-screen">
                    <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
                    <p className="text-lg mb-6">You must be signed in to view this page.</p>
                    <SignInButton mode="modal" />
                </div>
            </SignedOut>
        </section>
    );
}