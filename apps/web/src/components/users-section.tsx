'use client';

import { useState } from 'react';
import { useGetAllUsers, useCreateANewUser, useDeleteAUser } from '@/generated/api/users/users';
import type { CreateUser } from '@/generated/schemas';

export function UsersSection() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<CreateUser>({ email: '', name: '' });

  const { data, isLoading, error, refetch } = useGetAllUsers();
  const createUser = useCreateANewUser();
  const deleteUser = useDeleteAUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUser.mutateAsync({ data: formData });
      setFormData({ email: '', name: '' });
      setShowForm(false);
      refetch();
    } catch (err) {
      console.error('Failed to create user:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await deleteUser.mutateAsync({ id });
      refetch();
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'grid', gap: '1rem' }}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton" style={{ height: '80px' }} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="card" style={{ borderColor: 'var(--error)' }}>
        <p style={{ color: 'var(--error)' }}>Error loading users: {error.message}</p>
        <button className="btn btn-secondary" onClick={() => refetch()} style={{ marginTop: '1rem' }}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>
          Users <span style={{ color: 'var(--muted)', fontWeight: 400 }}>({data?.total || 0})</span>
        </h2>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '+ Add User'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            <div>
              <label className="label" htmlFor="email">Email *</label>
              <input
                id="email"
                type="email"
                className="input"
                placeholder="user@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label" htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                className="input"
                placeholder="John Doe"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value || undefined })}
              />
            </div>
          </div>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
            <button type="submit" className="btn btn-primary" disabled={createUser.isPending}>
              {createUser.isPending ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      )}

      <div style={{ display: 'grid', gap: '1rem' }}>
        {data?.data.map((user) => (
          <div key={user.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{user.name || 'Unnamed User'}</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>{user.email}</p>
              <p style={{ color: 'var(--muted)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                ID: {user.id}
              </p>
            </div>
            <button
              className="btn btn-danger"
              onClick={() => handleDelete(user.id)}
              disabled={deleteUser.isPending}
              style={{ fontSize: '0.75rem', padding: '0.5rem 0.75rem' }}
            >
              Delete
            </button>
          </div>
        ))}
        {data?.data.length === 0 && (
          <div className="card" style={{ textAlign: 'center', color: 'var(--muted)' }}>
            No users yet. Create one to get started!
          </div>
        )}
      </div>
    </section>
  );
}

