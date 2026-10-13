import { useEffect, useState } from 'react';
import type { Treaty } from '@elysia/eden';
import { Sidebar as SidebarView } from '@repo/ui/sidebar';
import { backend } from '../lib/api';
import { signOut } from '../lib/auth-client';

type Me = Treaty.Data<typeof backend.api.me.get>

export default function Sidebar () {
    const [me, setMe] = useState<Me | null>(null)

    useEffect(() => {
        backend.api.me.get().then(({ data }) => setMe(data))
    }, [])

    return <SidebarView name={me?.name} organizationName={me?.organizations[0]?.name} onSignOut={() => { signOut() }} />
}
