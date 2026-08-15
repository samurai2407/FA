// Floating AI chat button — all screen sizes
export default function AIChatButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label="Open AI assistant"
      className="fixed bottom-24 right-5 md:bottom-8 md:right-8 w-14 h-14 bg-[#00d09c] text-white rounded-full flex items-center justify-center text-2xl shadow-lg hover:scale-105 active:scale-95 transition-transform z-50 cursor-pointer"
    >
      🤖
    </button>
  );
}
