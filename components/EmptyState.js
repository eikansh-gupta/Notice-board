export default function EmptyState() {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-lg font-medium text-gray-600">No notices yet</p>
        <p className="text-sm text-gray-400 mt-1">
          Click "Add Notice" to create your first notice.
        </p>
      </div>
    );
  }