import './App.css'
import { Button, Label, Card, Form, Input, Link, TextField, FieldError, Description } from '@heroui/react';
import { Icon } from '@iconify/react';


function Signin() {

  return (
    <div className="flex flex-col gap-4 bg-background h-screen items-center justify-center ">
      <div>
        <Card className="p-6">
          <Card.Header>
            <Card.Title className="text-xl"> Signin </Card.Title>
            <Card.Description> Enter your Co(de)balt Credentials to access you account. </Card.Description>
          </Card.Header>
          <Card.Content>
            <TextField
              isRequired
              name="email"
              type="email"
              className = "pb-1"
              validate={(value) => {
                if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                  return "Please enter a valid email address";
                }
                return null;
              }}
            >
              <Label> Email </Label>
              <Input placeholder="email@codebalt.com" variant="secondary" />
              <FieldError />
            </TextField>
            <TextField
              isRequired
              minLength={8}
              className = "pb-2"
              name="password"
              type="password"
              validate={(value) => {
                if (value.length < 8) {
                  return "Password must be at least 8 characters";
                }
                if (!/[A-Z]/.test(value)) {
                  return "Password must contain at least one uppercase letter";
                }
                if (!/[0-9]/.test(value)) {
                  return "Password must contain at least one number";
                }
                return null;
              }}
            >
              <Label> Password </Label>
              <Input placeholder="••••••••" variant="secondary" />
              <Description>Must be at least 8 characters with 1 uppercase and 1 number</Description>
              <FieldError />
            </TextField>
            <Button fullWidth>
              Signin
            </Button>
            <div className="flex items-center my-4">
              <div className="flex-grow border-t border-separator"></div>
              <span className="mx-3 text-sm text-muted">OR</span>
              <div className="flex-grow border-t border-separator"></div>
            </div>
            <div className="flex flex-col gap-2">
              <Button className="w-full" variant="tertiary">
                <Icon icon="devicon:google" />
                Sign in with Google
              </Button>
              <Button className="w-full" variant="tertiary">
                <Icon icon="mdi:github" />
                Sign in with GitHub
              </Button>
            </div>
          </Card.Content>

        </Card>
      </div>
      <div className="flex">
        <p className="pr-1">
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
