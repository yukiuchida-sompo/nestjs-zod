'use client';

import { useState } from 'react';
import { UsersSection } from '@/components/users-section';
import { PostsSection } from '@/components/posts-section';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'users' | 'posts'>('users');

  return (
    <main className="container" style={{ padding: '2rem 1.5rem' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h1
          style={{
            fontSize: '2.25rem',
            fontWeight: 700,
            letterSpacing: '-0.025em',
            marginBottom: '0.5rem',
          }}
        >
          <span style={{ color: 'var(--accent)' }}>NestJS</span> + Zod + Prisma
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '1.125rem' }}>
          Full-stack TypeScript with auto-generated API client
        </p>
      </header>

      <nav
        style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '2rem',
          borderBottom: '1px solid var(--border)',
          paddingBottom: '0.5rem',
        }}
      >
        <button
          onClick={() => setActiveTab('users')}
          className="btn"
          style={{
            background: activeTab === 'users' ? 'var(--accent)' : 'transparent',
            color: activeTab === 'users' ? 'white' : 'var(--muted)',
          }}
        >
          👤 Users
        </button>
        <button
          onClick={() => setActiveTab('posts')}
          className="btn"
          style={{
            background: activeTab === 'posts' ? 'var(--accent)' : 'transparent',
            color: activeTab === 'posts' ? 'white' : 'var(--muted)',
          }}
        >
          📝 Posts
        </button>
      </nav>

      {activeTab === 'users' && <UsersSection />}
      {activeTab === 'posts' && <PostsSection />}

      <footer
        style={{
          marginTop: '4rem',
          paddingTop: '2rem',
          borderTop: '1px solid var(--border)',
          textAlign: 'center',
          color: 'var(--muted)',
          fontSize: '0.875rem',
        }}
      >
        <p>
          API Client auto-generated with{' '}
          <a href="https://orval.dev" target="_blank" rel="noopener noreferrer">
            Orval
          </a>{' '}
          from OpenAPI spec
        </p>
      </footer>
    </main>
  );
}

