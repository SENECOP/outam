import { useState } from "react";
import { Trash } from "lucide-react";

export default function CategoryManager() {
  const [categories, setCategories] = useState(["Brunch", "Petit déjeuner"]);
  const [newCategory, setNewCategory] = useState("");

  const addCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setNewCategory("");
    }
  };

  const removeCategory = (index) => {
    setCategories(categories.filter((_, i) => i !== index));
  };
  
  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold mb-2">Créer une catégorie</h2>
      <p className="text-gray-600 mb-4">
        Dans cet espace, vous pouvez créer vos catégories de Menu
      </p>

      {/* Nouvelle catégorie */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-1">Nouvelle catégorie</label>
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="Nom de la catégorie"
        />
      </div>

      {/* Boutons */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={addCategory}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Enregistrer
        </button>
        <button
          onClick={() => setNewCategory("")}
          className="border border-green-600 text-green-600 px-4 py-2 rounded hover:bg-green-100"
        >
          Annuler
        </button>
      </div>

      {/* Liste des catégories */}
      <h3 className="text-lg font-semibold mb-2">Liste des catégories</h3>
      <div className="space-y-2">
        {categories.map((category, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="text"
              value={category}
              readOnly
              className="border p-2 rounded w-full"
            />
            <button
              onClick={() => removeCategory(index)}
              className="bg-red-600 text-white p-2 rounded hover:bg-red-700"
            >
              <Trash size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
