import '../App.css'
import { useEffect, useState } from 'react';
import type { Treaty } from '@elysia/eden';
import { Button, Card } from '@heroui/react';
import { backend } from '../lib/api';
import { signOut } from '../lib/auth-client';

type Me = Treaty.Data<typeof backend.api.me.get>

export default function Sidebar () {
    const [me, setMe] = useState<Me | null>(null)

    useEffect(() => {
        backend.api.me.get().then(({ data }) => setMe(data))
    }, [])

    return (
        <div >
            <Card>
                <Card.Header>
                    <Card.Title>hello{me && `, ${me.name}`}!</Card.Title>
                    {me?.organizations[0] && <Card.Description>{me.organizations[0].name}</Card.Description>}
                </Card.Header>
                <Card.Footer>
                    <Button variant="tertiary" onPress={() => signOut()}>
                        Sign out
                    </Button>
                </Card.Footer>
            </Card>
        </div>
    )
}
