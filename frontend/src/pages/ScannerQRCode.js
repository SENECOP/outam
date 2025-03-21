<div className="max-w-4xl mx-auto p-4">
      <nav className="flex justify-between border-b pb-2 mb-4">
      <div className="flex space-x-24">

          <button className="font-bold">Menu actuel</button>
          <button>Gérer le menu</button>
          <button>Créer un menu</button>
          <button>QR Code</button>
          <button>Historique</button>
        </div>
      </nav>

      <div className="bg-white p-4 shadow rounded-lg">
        {menuItems.map((item) => (
          <div key={item.id} className="border-b py-2">
            <div className="flex justify-between items-center">
              <div>
                <strong>{item.name} ({item.price})</strong>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
              <button
                className="bg-gray-200 px-3 py-1 rounded"
                onClick={() => handleExpand(item.id)}
              >
                {expanded === item.id ? "fermer" : "développer"}
              </button>
            </div>
            {expanded === item.id && (
              <div className="mt-2">
                <input type="text" name="name" placeholder="Nom du plat" className="w-full border p-2 my-1" onChange={handleChange} />
                <input type="text" name="price" placeholder="Prix du plat" className="w-full border p-2 my-1" onChange={handleChange} />
                <textarea name="description" placeholder="Description du plat" className="w-full border p-2 my-1" onChange={handleChange} />
                <input type="file" className="w-full border p-2 my-1" />
                <button className="bg-green-600 text-white px-4 py-2 rounded">Enregistrer</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>