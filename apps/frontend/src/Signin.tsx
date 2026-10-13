import { useState } from 'react';
import { Link } from '@heroui/react';
import CodeStep from './components/sign-in/CodeStep';
import EmailStep from './components/sign-in/EmailStep';

function Signin() {
  const [email, setEmail] = useState("")
  const [codeSent, setCodeSent] = useState(false)

  return (
    <div className="flex flex-col gap-ui-16 bg-background min-h-screen items-center justify-center p-ui-16">
      {codeSent ? (
        <CodeStep email={email} onBack={() => setCodeSent(false)} />
      ) : (
        <EmailStep
          defaultEmail={email}
          onCodeSent={(sentTo) => {
            setEmail(sentTo)
            setCodeSent(true)
          }}
        />
      )}
      <div className="flex">
        <p className="pr-ui-4 text-muted">
          Don't have an account?
        </p>
        <Link href="#">
          Request a demo
          <Link.Icon />
        </Link>
      </div>
    </div>
  )
}

export default Signin
