import Link from 'next/link';
import PriorityBadge from './PriorityBadge';

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function NoticeCard({ notice, onDeleteClick }) {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden flex flex-col">
      {notice.image ? (
        <img
          src={notice.image}
          alt={notice.title}
          className="w-full h-40 object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      ) : null}

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
            {notice.category}
          </span>
          <PriorityBadge priority={notice.priority} />
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          {notice.title}
        </h3>

        <p className="text-sm text-gray-600 mb-3 line-clamp-3 flex-1">
          {notice.body}
        </p>

        <p className="text-xs text-gray-400 mb-3">
          Publish date: {formatDate(notice.publishDate)}
        </p>

        <div className="flex gap-2 mt-auto">
          <Link
            href={`/notice/${notice.id}`}
            className="flex-1 text-center text-sm font-medium px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Edit
          </Link>
          <button
            onClick={() => onDeleteClick(notice)}
            className="flex-1 text-sm font-medium px-3 py-2 rounded bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}