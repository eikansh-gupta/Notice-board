import Link from 'next/link';
import NoticeForm from '../../components/NoticeForm';

export default function NewNotice() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
            &larr; Back
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Add Notice</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <NoticeForm mode="create" />
      </main>
    </div>
  );
}