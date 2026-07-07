import { useState } from 'react';
import { useRouter } from 'next/router';

const CATEGORIES = ['Exam', 'Event', 'General'];
const PRIORITIES = ['Normal', 'Urgent'];

function toDateInputValue(dateValue) {
  if (!dateValue) return '';
  const date = new Date(dateValue);
  return date.toISOString().split('T')[0];
}

export default function NoticeForm({ mode, initialData, noticeId }) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    body: initialData?.body || '',
    category: initialData?.category || 'General',
    priority: initialData?.priority || 'Normal',
    publishDate: toDateInputValue(initialData?.publishDate) || '',
    image: initialData?.image || '',
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function validateClientSide() {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.body.trim()) errors.body = 'Body is required';
    if (!formData.publishDate) errors.publishDate = 'Publish date is required';
    return errors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError('');

    const errors = validateClientSide();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setSubmitting(true);

    const url = mode === 'edit' ? `/api/notices/${noticeId}` : '/api/notices';
    const method = mode === 'edit' ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.fields) {
          setFieldErrors(data.fields);
        }
        setSubmitError(data.error || 'Something went wrong. Please try again.');
        setSubmitting(false);
        return;
      }

      router.push('/');
    } catch (err) {
      setSubmitError('Network error. Please try again.');
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-5">
      {submitError && (
        <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded border border-red-200">
          {submitError}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Notice title"
        />
        {fieldErrors.title && (
          <p className="text-xs text-red-600 mt-1">{fieldErrors.title}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Body
        </label>
        <textarea
          name="body"
          value={formData.body}
          onChange={handleChange}
          rows={5}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Notice details"
        />
        {fieldErrors.body && (
          <p className="text-xs text-red-600 mt-1">{fieldErrors.body}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Publish Date
        </label>
        <input
          type="date"
          name="publishDate"
          value={formData.publishDate}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {fieldErrors.publishDate && (
          <p className="text-xs text-red-600 mt-1">{fieldErrors.publishDate}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Image URL <span className="text-gray-400">(optional)</span>
        </label>
        <input
          type="text"
          name="image"
          value={formData.image}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 bg-blue-600 text-white font-medium py-2 rounded hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {submitting
            ? 'Saving...'
            : mode === 'edit'
            ? 'Update Notice'
            : 'Create Notice'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/')}
          className="px-4 py-2 text-sm font-medium rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}