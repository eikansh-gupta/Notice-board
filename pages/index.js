import { useState } from 'react';
import Link from 'next/link';
import prisma from '../lib/prisma';
import NoticeCard from '../components/NoticeCard';
import EmptyState from '../components/EmptyState';

export async function getServerSideProps() {
  const notices = await prisma.notice.findMany({
    orderBy: [
      { priority: 'desc' },
      { publishDate: 'desc' },
    ],
  });

  return {
    props: {
      initialNotices: JSON.parse(JSON.stringify(notices)),
    },
  };
}

export default function Home({ initialNotices }) {
  const [notices, setNotices] = useState(initialNotices);
  const [noticeToDelete, setNoticeToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  async function handleConfirmDelete() {
    if (!noticeToDelete) return;
    setDeleting(true);
    setErrorMsg('');

    try {
      const res = await fetch(`/api/notices/${noticeToDelete.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete notice');
      }

      setNotices((prev) => prev.filter((n) => n.id !== noticeToDelete.id));
      setNoticeToDelete(null);
    } catch (err) {
      setErrorMsg('Could not delete notice. Please try again.');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Notice Board</h1>
          <Link
            href="/notice/new"
            className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            + Add Notice
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {errorMsg && (
          <div className="mb-4 bg-red-50 text-red-700 text-sm px-4 py-3 rounded border border-red-200">
            {errorMsg}
          </div>
        )}

        {notices.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {notices.map((notice) => (
              <NoticeCard
                key={notice.id}
                notice={notice}
                onDeleteClick={setNoticeToDelete}
              />
            ))}
          </div>
        )}
      </main>

      {noticeToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Delete this notice?
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              "{noticeToDelete.title}" will be deleted permanently.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setNoticeToDelete(null)}
                disabled={deleting}
                className="px-4 py-2 text-sm font-medium rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="px-4 py-2 text-sm font-medium rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}