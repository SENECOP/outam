<div className="flex h-screen bg-gray-100">
  <Sidebar isSidebarOpen={isSidebarOpen} />
  <div className="flex-1 flex flex-col overflow-hidden">
    <Header toggleSidebar={toggleSidebar} />
    <main className="flex-1 overflow-y-auto p-4 ml-1">
      <nav className="bg-white shadow-sm rounded-lg mb-6 p-4 mr-[500px]">
        <div className="flex space-x-6">
          <Link to={`/restaurant/${restaurantId}`} className="text-gray-600 hover:text-gray-800 px-3 py-2">
            Menu actuel
          </Link>
          <Link to={`/gerermenu/${restaurantId}`} className="text-gray-600 hover:text-gray-800 px-3 py-2">
            Gérer menu
          </Link>
          <Link to={`/restaurant/${restaurantId}/menu/create`} className="font-medium text-blue-600 px-3 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
            Créer un menu
          </Link>
          <Link to={`/restaurants/${restaurantId}/qrcode`} className="text-gray-600 hover:text-gray-800 px-3 py-2">
            QR Code
          </Link>
          <button className="text-gray-600 hover:text-gray-800 px-3 py-2">Historique</button>
        </div>
      </nav>

      <div className="bg-white shadow-sm rounded-lg mb-6 p-4">
        <h2 className="text-xl font-semibold mb-2">Création de menu</h2>
        <p className="text-gray-600 mb-4">Dans cet espace, vous pouvez créer un nouveau menu</p>
        
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              placeholder="Titre du menu"
              value={menuTitle}
              onChange={(e) => setMenuTitle(e.target.value)}
              className="w-3/6 p-2 border rounded"
              required
            />
            <button 
              type="button" 
              className="bg-gray-300 px-4 py-2 rounded mr-[600px]"
              onClick={() => navigate(`/gerermenu/${restaurantId}`)}
            >
              Ignorer
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col space-y-4">
              {dishes.map((dish, index) => (
                <div key={index} className="mb-4 p-4 border rounded relative">
                  <button
                    type="button"
                    onClick={() => removeDish(index)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                  
                  <input
                    type="text"
                    placeholder="Nom du plat"
                    value={dish.title}
                    onChange={(e) => handleDishChange(index, "title", e.target.value)}
                    className="w-full p-2 border rounded mb-2"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Prix du plat"
                    value={dish.price}
                    onChange={(e) => handleDishChange(index, "price", e.target.value)}
                    className="w-full p-2 border rounded mb-2"
                    required
                  />
                  <textarea
                    placeholder="Description du plat"
                    value={dish.description}
                    onChange={(e) => handleDishChange(index, "description", e.target.value)}
                    className="w-full p-2 border rounded mb-2"
                  />
                  <input
                    type="file"
                    onChange={(e) => handleImageUpload(index, e.target.files[0])}
                    className="w-full p-2 border rounded mb-2"
                    accept="image/*"
                  />
                  {dish.image && (
                    <div className="mt-2">
                      <img
                        src={URL.createObjectURL(dish.image)}  // Crée une URL locale pour l'aperçu
                        alt="Aperçu du plat"
                        className="w-32 h-32 object-cover rounded"
                      />
                    </div>
                  )}
                  <select
                    value={dish.category}
                    onChange={(e) => handleDishChange(index, "category", e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="Lunch">Lunch</option>
                    <option value="Brunch">Brunch</option>
                    <option value="Déjeuner">Déjeuner</option>
                    <option value="Dîner">Dîner</option>
                    <option value="Dessert">Dessert</option>
                  </select>
                </div>
              ))}

              <button 
                type="button"
                onClick={addDish} 
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              > 
                + Ajouter un plat
              </button>
            </div>

            <div className="flex flex-col space-y-4">
              <h3 className="text-green-800 font-medium mb-4">Suggestions de plats</h3>
              <div className="space-y-2">
                {suggestedDishes.map((suggestion) => (
                  <button 
                    key={suggestion._id}  // Utilisez l'_id si disponible
                    onClick={() => {
                      const newDish = {
                        title: suggestion.title,
                        description: suggestion.description || "",
                        price: suggestion.price || "",
                        category: suggestion.category || "plat",
                      };
                      setDishes([...dishes, newDish]);
                    }}
                    className="bg-white hover:bg-green-400 border border-green-200 text-green-700 px-2 py-1 rounded-lg transition-colors text-sm"
                  >
                    {suggestion.title}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col">
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-[40%] bg-green-600 text-white px-4 py-2 rounded mb-4 text-center hover:bg-green-700 disabled:bg-green-400"
            >
              {isLoading ? "Enregistrement..." : "Enregistrer"}
            </button>
            <button 
              type="button"
              onClick={() => navigate(`/gerermenu/${restaurantId}`)}
              className="w-[40%] bg-gray-200 text-gray-700 px-4 py-2 rounded text-center border hover:bg-gray-300"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </main>
  </div>
</div>
