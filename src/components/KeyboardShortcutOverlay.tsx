import React from 'react';

interface KeyboardShortcutOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const KeyboardShortcutOverlay: React.FC<KeyboardShortcutOverlayProps> = ({ 
  isOpen, 
  onClose 
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl p-8 w-[480px] max-h-[80vh] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Keyboard Shortcuts</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto max-h-[calc(80vh-8rem)]">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Navigation</h3>
              <table className="w-full">
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="py-2 pr-4">
                      <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">⌘</kbd>
                      <span className="mx-1">+</span>
                      <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">1</kbd>
                    </td>
                    <td className="py-2 pl-4 text-sm text-gray-600">Go to Home</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">
                      <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">⌘</kbd>
                      <span className="mx-1">+</span>
                      <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">2</kbd>
                    </td>
                    <td className="py-2 pl-4 text-sm text-gray-600">Go to Board View</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">
                      <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">⌘</kbd>
                      <span className="mx-1">+</span>
                      <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">3</kbd>
                    </td>
                    <td className="py-2 pl-4 text-sm text-gray-600">Go to Table View</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">
                      <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">⌘</kbd>
                      <span className="mx-1">+</span>
                      <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">4</kbd>
                    </td>
                    <td className="py-2 pl-4 text-sm text-gray-600">Go to Calendar View</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">
                      <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">⌘</kbd>
                      <span className="mx-1">+</span>
                      <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">5</kbd>
                    </td>
                    <td className="py-2 pl-4 text-sm text-gray-600">Go to Timeline View</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">General</h3>
              <table className="w-full">
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="py-2 pr-4">
                      <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">⌘</kbd>
                      <span className="mx-1">+</span>
                      <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">K</kbd>
                    </td>
                    <td className="py-2 pl-4 text-sm text-gray-600">Show Keyboard Shortcuts</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">
                      <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">Esc</kbd>
                    </td>
                    <td className="py-2 pl-4 text-sm text-gray-600">Close Modal / Cancel</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcutOverlay;
