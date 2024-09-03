'use client'

import { signIn } from "next-auth/react";

const SignIn = ({ setSignLoading }: { setSignLoading: (signLoading: boolean) => void }) => {
  const handleSignIn = (provider: string) => {
    setSignLoading(true);
    signIn(provider, { callbackUrl: '/' });
  };

  return (
    <div className="mt-16 flex flex-col items-center justify-center">
      <button
        onClick={() => handleSignIn('github')}
        className="w-48 px-4 py-2 mb-8 bg-black text-white font-semibold rounded hover:bg-gray-800 transition duration-200"
      >
        GitHub
      </button>
      <button
        onClick={() => handleSignIn('kakao')}
        className="w-48 px-4 py-2 bg-yellow-400 text-black font-semibold rounded hover:bg-yellow-500 transition duration-200"
      >
        Kakao
      </button>
    </div>
  );
}

export default SignIn;
