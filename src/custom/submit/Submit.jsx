
import { Loader } from "lucide-react";
import { SquarePlus, Edit } from "lucide-react";

export default function SubmitButton({ id, isLoading, name }) {
  return (
    <>
      <div className="pb-10 mt-4">
        <div className="mb-2 border-t border-dashed border-green-500"></div>
        <button
          className="cursor-pointer flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-green-500 rounded-xs hover:bg-green-600 active:bg-green-700 disabled:bg-gray-400"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-1">
              <Loader className="animate-spin h-5 w-5" />
              <span>PROCESSING...</span>
            </div>
          ) : id ? (
            <>
              <div className="flex items-center gap-1">
                <Edit size={18} /> <span>Update {name}</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-1">
                <SquarePlus strokeWidth={3} size={18} /> Create {name}
              </div>
            </>
          )}
        </button>
      </div>
    </>
  );
}
