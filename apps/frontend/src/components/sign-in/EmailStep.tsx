import { useState, type FormEvent } from 'react';
import { Alert, Card, Description, FieldError, Form, Input, Label, TextField } from '@heroui/react';
import { Button } from '../Button';
import { emailOtp, retryAfterOf, signIn } from '../../lib/auth-client';
import { useCooldown } from '../../lib/use-cooldown';

function consumeSsoError() {
  const url = new URL(window.location.href)
  if (!url.searchParams.has("error")) return false
  url.searchParams.delete("error")
  window.history.replaceState(null, "", url)
  return true
}

type Failure = { title: string; description: string } | null

const ssoFailure = {
  title: "Single sign-on didn't finish",
  description: "Try again, or contact your administrator if it keeps happening.",
}

type Props = {
  defaultEmail: string
  onCodeSent: (email: string) => void
}

export default function EmailStep({ defaultEmail, onCodeSent }: Props) {
  const [failure, setFailure] = useState<Failure>(() => (consumeSsoError() ? ssoFailure : null))
  const [isPending, setIsPending] = useState(false)
  const [cooldown, startCooldown] = useCooldown()

  const continueWith = async (email: string) => {
    const route = await signIn.identify({ email })
    if (route.error) return route.error
    if (route.data.method === "sso") {
      const { error } = await signIn.sso({
        providerId: route.data.providerId,
        loginHint: email,
        callbackURL: window.location.origin,
        errorCallbackURL: window.location.origin,
      })
      return error
    }
    const { error } = await emailOtp.sendVerificationOtp({ email, type: "sign-in" })
    if (!error) onCodeSent(email)
    return error
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const email = String(new FormData(event.currentTarget).get("email")).trim()
    setFailure(null)
    setIsPending(true)
    const error = await continueWith(email)
    if (!error) return
    setIsPending(false)
    const wait = retryAfterOf(error)
    if (wait) startCooldown(wait)
    else setFailure({ title: "We couldn't sign you in", description: "Something went wrong on our side. Please try again." })
  }

  return (
    <Card className="w-full max-w-sm p-6">
      <Card.Header>
        <Card.Title className="text-xl">Sign in</Card.Title>
        <Card.Description>Use your work email to access your Co(de)balt account.</Card.Description>
      </Card.Header>
      <Card.Content>
        <Form
          className="flex flex-col gap-4"
          validationErrors={cooldown > 0 ? { email: `Too many attempts. Try again in ${cooldown}s.` } : {}}
          onSubmit={handleSubmit}
        >
          {failure && (
            <Alert status="danger">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>{failure.title}</Alert.Title>
                <Alert.Description>{failure.description}</Alert.Description>
              </Alert.Content>
            </Alert>
          )}
          <TextField
            isRequired
            autoFocus
            name="email"
            type="email"
            autoComplete="email"
            defaultValue={defaultEmail}
            validate={(value) =>
              /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value) ? null : "Please enter a valid email address"
            }
          >
            <Label>Work email</Label>
            <Input placeholder="you@company.com" variant="secondary" />
            <Description>We'll email you a code on the next screen.</Description>
            <FieldError />
          </TextField>
          <Button fullWidth variant="primary" type="submit" loading={isPending}>
            Continue
          </Button>
        </Form>
      </Card.Content>
    </Card>
  )
}
