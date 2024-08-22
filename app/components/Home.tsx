'use client';

import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { deleteUser } from '@/app/actions/deleteUser';

const Home = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const handleLogin = () => {
    router.push('/auth/signin');
  };

  const handleLogout = () => {
    signOut();
  }

  const handleWithdrawal = async () => {
    try {
      await deleteUser();
      signOut();
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  }

  if (status === 'loading') {
    return (<div>loading...</div>);
  }

  return (
    <div>
      <h1>Welcome {session ? session.user?.name : 'to Our Service'}</h1>
      {session?.user?.image && (
        <div>
          <Image
            src={session.user.image}
            alt={`${session.user.name}'s profile`} 
            width={50} 
            height={50} 
            priority={true}
          />
        </div>
      )}
      <div>
        <button onClick={session ? handleLogout : handleLogin}>
          {session ? 'Logout' : 'Login'}
        </button>
        {session && (
          <button onClick={handleWithdrawal}>
            withdrawal
          </button>
        )}
      </div>
    </div>
  );
};

export default Home;
