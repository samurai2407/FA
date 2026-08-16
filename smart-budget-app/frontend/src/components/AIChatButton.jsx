// Floating AI chat button — all screen sizes
export default function AIChatButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label="Open AI assistant"
      className="fixed bottom-24 right-5 md:bottom-8 md:right-8 w-14 h-14 bg-[#4B58FF] text-white rounded-[18px] flex items-center justify-center text-2xl shadow-lg shadow-[#4B58FF]/30 hover:scale-105 hover:bg-[#3a46e0] active:scale-95 transition-all z-50 cursor-pointer"
    >
      🤖
    </button>
  );
}
