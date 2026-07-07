export default function PriorityBadge({ priority }) {
    const isUrgent = priority === 'Urgent';
  
    return (
      <span
        className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
          isUrgent
            ? 'bg-red-600 text-white'
            : 'bg-gray-200 text-gray-700'
        }`}
      >
        {priority}
      </span>
    );
  }