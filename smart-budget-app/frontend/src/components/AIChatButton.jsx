// Floating AI chat button — mobile only
export default function AIChatButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label="Open AI assistant"
      className="md:hidden fixed bottom-20 right-5 w-14 h-14 bg-[#00d09c] text-white rounded-full flex items-center justify-center text-2xl shadow-lg hover:scale-105 active:scale-95 transition-transform z-50 cursor-pointer"
    >
      🤖
    </button>
  );
}
