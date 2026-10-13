import { useState, type FormEvent } from 'react';
import { Card, Description, Form, InputOTP, Label, REGEXP_ONLY_DIGITS } from '@heroui/react';
import { Button } from '@repo/ui/button';
import { emailOtp, retryAfterOf, signIn } from '../../lib/auth-client';
import { useCooldown } from '../../lib/use-cooldown';

const RESEND_SECONDS = 30

const errorMessages: Record<string, string> = {
  INVALID_OTP: "That code isn't right. Check the email and try again.",
  OTP_EXPIRED: "This code has expired. Send yourself a new one.",
  TOO_MANY_ATTEMPTS: "Too many incorrect tries. Send yourself a new code.",
}

type Props = {
  email: string
  onBack: () => void
}

export default function CodeStep({ email, onBack }: Props) {
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [isPending, setIsPending] = useState(false)
  const [verifyCooldown, startVerifyCooldown] = useCooldown()
  const [resendCooldown, startResendCooldown] = useCooldown(RESEND_SECONDS)
  const fieldError = verifyCooldown > 0 ? `Too many attempts. Try again in ${verifyCooldown}s.` : error

  const verify = async (otp: string) => {
    if (isPending) return
    setError("")
    setIsPending(true)
    const { error } = await signIn.emailOtp({ email, otp })
    if (!error) return
    setIsPending(false)
    const wait = retryAfterOf(error)
    if (wait) return startVerifyCooldown(wait)
    setError(errorMessages[error.code ?? ""] ?? "Something went wrong. Please try again.")
    if (error.code !== "INVALID_OTP") setCode("")
  }

  const resend = async () => {
    setError("")
    setCode("")
    const { error } = await emailOtp.sendVerificationOtp({ email, type: "sign-in" })
    startResendCooldown(retryAfterOf(error) || RESEND_SECONDS)
    if (error && error.status !== 429) setError("We couldn't send a new code. Please try again.")
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    verify(code)
  }

  return (
    <Card className="w-full max-w-sm p-6">
      <Card.Header>
        <Card.Title className="text-xl">Check your email</Card.Title>
        <Card.Description>
          We sent a 6-digit code to <span className="font-medium text-foreground">{email}</span>.
        </Card.Description>
      </Card.Header>
      <Card.Content>
        <Form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <Label id="code-label">Sign-in code</Label>
            <Description id="code-description">The code expires in 5 minutes.</Description>
            <InputOTP
              autoFocus
              maxLength={6}
              name="code"
              pattern={REGEXP_ONLY_DIGITS}
              variant="secondary"
              value={code}
              isInvalid={!!fieldError}
              validationErrors={fieldError ? [fieldError] : []}
              aria-labelledby="code-label"
              aria-describedby={fieldError ? "code-description code-error" : "code-description"}
              onChange={(value) => {
                setCode(value)
                setError("")
              }}
              onComplete={verify}
            >
              <InputOTP.Group>
                <InputOTP.Slot index={0} />
                <InputOTP.Slot index={1} />
                <InputOTP.Slot index={2} />
              </InputOTP.Group>
              <InputOTP.Separator />
              <InputOTP.Group>
                <InputOTP.Slot index={3} />
                <InputOTP.Slot index={4} />
                <InputOTP.Slot index={5} />
              </InputOTP.Group>
            </InputOTP>
            <span className="field-error" data-visible={!!fieldError} id="code-error">
              {fieldError}
            </span>
          </div>
          <Button fullWidth variant="primary" type="submit" loading={isPending} disabled={code.length !== 6 || verifyCooldown > 0}>
            Sign in
          </Button>
          <div className="flex items-center justify-between">
            <Button size="sm" variant="ghost" onClick={onBack}>
              Use a different email
            </Button>
            <Button size="sm" variant="ghost" disabled={resendCooldown > 0} onClick={resend}>
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
            </Button>
          </div>
        </Form>
      </Card.Content>
    </Card>
  )
}
