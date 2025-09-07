'use client';
import { useSession, signIn, signOut } from 'next-auth/react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import * as React from 'react';

function initials(name?: string | null) {
  if (!name) return 'US';
  return name.split(' ').map(n => n[0]?.toUpperCase()).slice(0, 2).join('');
}

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div className="h-9 w-44 animate-pulse rounded-md bg-muted" aria-hidden />;
  }

  if (status !== 'authenticated' || !session?.user) {
    return (
      <Button onClick={() => signIn('discord')} className="gap-2" aria-label="Sign in with Discord">
        <Image src="/icons/discord.svg" alt="" width={20} height={20} priority />
        <span>Sign in with Discord</span>
      </Button>
    );
  }

  const user = session.user;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full focus:outline-none" aria-label="Open user menu">
        <Avatar className="h-8 w-8">
          <AvatarImage src={user.image ?? ''} alt={user.name ?? 'User'} />
          <AvatarFallback>{initials(user.name)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem asChild><a href="/dashboard">Dashboard</a></DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })}>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
