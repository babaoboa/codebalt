import './App.css'
import { Button, CardHeader, Label, Card, Form, Input, Link, TextField, FieldError, Description } from '@heroui/react';


function Signin() {

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <Card>
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
        </Card.Content>
      </Card>
    </div>
  )
}

export default Signin
