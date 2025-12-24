'use client';

import { useState } from 'react';
import {
  useGetAllPosts,
  useCreateANewPost,
  useDeleteAPost,
  usePublishAPost,
  useUnpublishAPost,
} from '@/generated/api/posts/posts';
import { useGetAllUsers } from '@/generated/api/users/users';
import type { CreatePost } from '@/generated/schemas';

export function PostsSection() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<CreatePost>({
    title: '',
    content: '',
    authorId: '',
    published: false,
  });

  const { data: postsData, isLoading, error, refetch } = useGetAllPosts();
  const { data: usersData } = useGetAllUsers();
  const createPost = useCreateANewPost();
  const deletePost = useDeleteAPost();
  const publishPost = usePublishAPost();
  const unpublishPost = useUnpublishAPost();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createPost.mutateAsync({ data: formData });
      setFormData({ title: '', content: '', authorId: '', published: false });
      setShowForm(false);
      refetch();
    } catch (err) {
      console.error('Failed to create post:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      await deletePost.mutateAsync({ id });
      refetch();
    } catch (err) {
      console.error('Failed to delete post:', err);
    }
  };

  const handleTogglePublish = async (id: string, currentlyPublished: boolean) => {
    try {
      if (currentlyPublished) {
        await unpublishPost.mutateAsync({ id });
      } else {
        await publishPost.mutateAsync({ id });
      }
      refetch();
    } catch (err) {
      console.error('Failed to toggle publish status:', err);
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'grid', gap: '1rem' }}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton" style={{ height: '120px' }} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="card" style={{ borderColor: 'var(--error)' }}>
        <p style={{ color: 'var(--error)' }}>Error loading posts: {error.message}</p>
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
          Posts <span style={{ color: 'var(--muted)', fontWeight: 400 }}>({postsData?.total || 0})</span>
        </h2>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '+ Add Post'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <label className="label" htmlFor="title">Title *</label>
              <input
                id="title"
                type="text"
                className="input"
                placeholder="My awesome post"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label" htmlFor="content">Content</label>
              <textarea
                id="content"
                className="input"
                placeholder="Write your post content here..."
                value={formData.content || ''}
                onChange={(e) => setFormData({ ...formData, content: e.target.value || undefined })}
                rows={4}
                style={{ resize: 'vertical' }}
              />
            </div>
            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
              <div>
                <label className="label" htmlFor="authorId">Author *</label>
                <select
                  id="authorId"
                  className="input"
                  value={formData.authorId}
                  onChange={(e) => setFormData({ ...formData, authorId: e.target.value })}
                  required
                >
                  <option value="">Select an author</option>
                  {usersData?.data.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name || user.email}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '1.5rem' }}>
                <input
                  id="published"
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                />
                <label htmlFor="published" style={{ fontSize: '0.875rem' }}>Publish immediately</label>
              </div>
            </div>
          </div>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
            <button type="submit" className="btn btn-primary" disabled={createPost.isPending}>
              {createPost.isPending ? 'Creating...' : 'Create Post'}
            </button>
          </div>
        </form>
      )}

      <div style={{ display: 'grid', gap: '1rem' }}>
        {postsData?.data.map((post) => (
          <div key={post.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <div>
                <h3 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{post.title}</h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>
                  by {post.author.name || post.author.email}
                </p>
              </div>
              <span className={`badge ${post.published ? 'badge-success' : 'badge-warning'}`}>
                {post.published ? 'Published' : 'Draft'}
              </span>
            </div>
            {post.content && (
              <p style={{ color: 'var(--foreground)', fontSize: '0.875rem', marginBottom: '1rem', opacity: 0.8 }}>
                {post.content.length > 200 ? `${post.content.slice(0, 200)}...` : post.content}
              </p>
            )}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                className={`btn ${post.published ? 'btn-secondary' : 'btn-success'}`}
                onClick={() => handleTogglePublish(post.id, post.published)}
                style={{ fontSize: '0.75rem', padding: '0.5rem 0.75rem' }}
              >
                {post.published ? 'Unpublish' : 'Publish'}
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleDelete(post.id)}
                disabled={deletePost.isPending}
                style={{ fontSize: '0.75rem', padding: '0.5rem 0.75rem' }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {postsData?.data.length === 0 && (
          <div className="card" style={{ textAlign: 'center', color: 'var(--muted)' }}>
            No posts yet. Create one to get started!
          </div>
        )}
      </div>
    </section>
  );
}

