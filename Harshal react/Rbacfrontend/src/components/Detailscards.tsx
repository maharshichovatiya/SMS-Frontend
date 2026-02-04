import type { Items } from "../pages/Home";

interface DetailsCardProps {
  data: Items[];
  onDelete: (id: number) => void;
  onUpdate: (item: Items) => void;
}

export function DetailsCard({ data, onDelete, onUpdate }: DetailsCardProps) {
  return (
    <>
      {data ? (
        data.map((itm: Items, indx: number) => (
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl relative p-6 mb-4" key={indx}>
            <p className="text-2xl font-bold text-white mb-3">{itm.name}</p>
            <p className="text-slate-400 mb-4 pr-32">{itm.description}</p>
            <p className="text-3xl font-bold text-blue-400 mb-6">${itm.price}</p>
            <div className="absolute right-6 bottom-10 flex gap-3">
              <button
                onClick={() => onUpdate(itm)}
                className="px-6 py-2 cursor-pointer bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg font-medium text-sm transition-all duration-200"
              >
                Update
              </button>
              <button
                onClick={() => onDelete(itm.id)}
                className="px-6 py-2 cursor-pointer bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 rounded-lg font-medium text-sm transition-all duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="text-slate-400 text-center">no products</div>
      )}
    </>
  );
}