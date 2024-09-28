import { SignIn, SignUp, SignedIn, SignedOut } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from 'react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <SignedIn>
        {/* This content will only be visible to signed-in users */}
        {redirect('/dashboard')}
      </SignedIn>
      <SignedOut>
        {/* This content will only be visible to signed-out users */}
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold mb-4 text-center">Welcome to Our App</h1>
          <SignIn />
          <div className="mt-4 text-center">
            <p>Don't have an account?</p>
            <SignUp />
          </div>
        </div>
      </SignedOut>
    </div>
  );
}