export default function Notification({ message, show }) {
  if (!show) return null;
  return (
    <div className="fixed top-6 right-6 bg-yellow-200 border-l-4 border-yellow-500 text-yellow-900 p-4 rounded shadow">
      {message}
    </div>
  );
}