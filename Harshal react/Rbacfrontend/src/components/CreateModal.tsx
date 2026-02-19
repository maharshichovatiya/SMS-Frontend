import { useState } from "react";
import toast from "react-hot-toast";

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description: string; price: string }) => void;
}

export function CreateModal({ isOpen, onClose, onSubmit }: CreateModalProps) {
  const [formData, setFormData] = useState({ name: "", description: "", price: "" });

  const handleSubmit = () => {
    if (!formData.name || !formData.description || !formData.price) {
      toast.error("Please fill all fields");
      return;
    }
    onSubmit(formData);
    setFormData({ name: "", description: "", price: "" });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full mx-4 border border-slate-700/50">
        <h2 className="text-2xl font-bold text-white mb-6">Create New Product</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-slate-300 text-sm mb-2">Product Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter product name"
              className="w-full px-4 py-2 bg-slate-700/30 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter product description"
              className="w-full px-4 py-2 bg-slate-700/30 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:border-blue-500 outline-none transition-all h-24 resize-none"
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm mb-2">Price</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="Enter price"
              className="w-full px-4 py-2 bg-slate-700/30 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-2 bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30 rounded-lg font-medium transition-all"
          >
            Create
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-500/20 text-gray-400 hover:bg-gray-500/30 border border-gray-500/30 rounded-lg font-medium transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}