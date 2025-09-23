// components/AuthButton.tsx
'use client';

import * as React from 'react';
import Image from 'next/image';
import { useSession, signIn, signOut } from 'next-auth/react';

function initials(name?: string | null) {
  if (!name) return 'US';
  return name.split(' ').map(n => n[0]?.toUpperCase()).slice(0, 2).join('');
}

export default function AuthButton() {
  const { data: session, status } = useSession();
  const [open, setOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!open) return;
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  if (status === 'loading') {
    return <div className="h-9 w-44 animate-pulse rounded-md bg-zinc-800/60" aria-hidden />;
  }

  if (status !== 'authenticated' || !session?.user) {
    return (
      <button
        onClick={() => signIn('discord')}
        className="inline-flex h-9 items-center gap-2 rounded-md bg-zinc-800 px-3 text-sm text-zinc-100 hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        aria-label="Sign in with Discord"
      >
        <svg width="20" height="20" viewBox="0 0 127.14 96.36" aria-hidden="true" className="text-zinc-100">
          <path
            fill="currentColor"
            d="M107.7 8.07A105.15 105.15 0 0 0 81.47 0a72.06 72.06 0 0 0-3.36 6.91 97.68 97.68 0 0 0-29.08 0A72.06 72.06 0 0 0 45.67 0 105.89 105.89 0 0 0 19.39 8.09C2.79 32.65-1.71 56.6.54 80.21A106.27 106.27 0 0 0 33 96.36c2.63-3.49 4.94-7.19 6.89-11.08a68.42 68.42 0 0 1-10.85-5.17c.91-.66 1.79-1.35 2.64-2.09a74.78 74.78 0 0 0 62.78 0c.86.73 1.74 1.42 2.64 2.09a68.68 68.68 0 0 1-10.87 5.18c1.95 3.88 4.25 7.58 6.89 11.07a106.14 106.14 0 0 0 32.46-16.13c2.66-27.58-4.56-51.34-18.78-72.06ZM42.42 65.69c-6.07 0-11-5.63-11-12.56s4.9-12.56 11-12.56S53.4 46.2 53.4 53.13s-4.9 12.56-11 12.56Zm42.3 0c-6.07 0-11-5.63-11-12.56s4.9-12.56 11-12.56 11 5.63 11 12.56-4.91 12.56-11 12.56Z"
          />
        </svg>
        <span>Sign in with Discord</span>
      </button>
    );
  }

  const user = session.user;
  const avatarUrl = (user.image as string | undefined) || '';
  const initialsText = initials(user.name);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(o => !o)}
        className="inline-flex items-center justify-center rounded-full border border-zinc-700 bg-zinc-800 p-0.5 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Open user menu"
      >
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={user.name ?? 'User'}
            className="h-8 w-8 rounded-full object-cover"
            width={32}
            height={32}
            priority
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-zinc-700 text-center text-xs leading-8 text-zinc-100">
            {initialsText}
          </div>
        )}
      </button>

      {open && (
        <div
          role="menu"
          tabIndex={-1}
          className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-md border border-zinc-700 bg-zinc-900 shadow-lg"
        >
          <div className="px-3 py-2 font-semibold text-zinc-100 border-b border-zinc-800">
            {user.name ?? user.email ?? "User"}
          </div>
          <a
            role="menuitem"
            href="/account"
            className="block px-3 py-2 text-sm text-zinc-100 hover:bg-zinc-800"
            onClick={() => setOpen(false)}
          >
            User Options
          </a>
          <div className="my-1 h-px bg-zinc-800" />
          <button
            role="menuitem"
            onClick={() => signOut({ callbackUrl: '/' })}
            className="block w-full px-3 py-2 text-left text-sm text-zinc-100 hover:bg-zinc-800"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
