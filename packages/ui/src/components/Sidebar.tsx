import { Card } from '@heroui/react';
import { Button } from './Button';

export type SidebarProps = {
  name?: string;
  organizationName?: string;
  onSignOut: () => void;
};

export function Sidebar({ name, organizationName, onSignOut }: SidebarProps) {
  return (
    <div>
      <Card>
        <Card.Header>
          <Card.Title>hello{name && `, ${name}`}!</Card.Title>
          {organizationName && <Card.Description>{organizationName}</Card.Description>}
        </Card.Header>
        <Card.Footer>
          <Button variant="ghost" onClick={onSignOut}>Sign out</Button>
        </Card.Footer>
      </Card>
    </div>
  );
}
