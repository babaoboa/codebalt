import { Spinner } from '@heroui/react';
import Backend from './Backend';
import Signin from './Signin';
import { useSession } from './lib/auth-client';

function App() {
  const { data: session, isPending, isRefetching } = useSession()

  if (isPending && !isRefetching) {
    return (
      <div className="flex bg-background h-screen items-center justify-center">
        <Spinner />
      </div>
    )
  }

  return session ? <Backend /> : <Signin />
}

export default App
