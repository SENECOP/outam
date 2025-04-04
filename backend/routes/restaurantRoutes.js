const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Restaurant = require('../models/Restaurant');  // Modèle Restaurant
const router = express.Router();
const multer = require('multer');

// Secret pour JWT (vous pouvez le stocker dans une variable d'environnement)
const JWT_SECRET = 'votre-secret-pour-jwt';
// Configuration de Multer
const path = require('path');
const mongoose = require("mongoose");
const validateMenuItem = (req, res, next) => {
    if (req.body.price && isNaN(Number(req.body.price))) {
      return res.status(400).json({ success: false, message: "Le prix doit être un nombre valide" });
    }
    next();
  };

// Chemin absolu vers le dossier uploads
const uploadPath = path.join(__dirname, '..', 'uploads');

// Créer le dossier s'il n'existe pas
const fs = require('fs');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);  // Utilisation du chemin absolu
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }  // 5MB max
});

router.post('/registeresto', async (req, res) => {
    const { name, email, motDePasse, commercantName } = req.body;
  
    if (!name || !email || !motDePasse || !commercantName) {
      return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }
  
    try {
      // Vérifie si le commerçant existe déjà
      const existingRestaurant = await Restaurant.findOne({ 'commercantInfo.email': email });
      if (existingRestaurant) {
        return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
      }
  
      // Hash du mot de passe
      const hashedPassword = await bcrypt.hash(motDePasse, 12);
  
      // Création du restaurant
      const newRestaurant = new Restaurant({
        name,
        commercantInfo: {
          name: commercantName,
          email,
          motDePasse: hashedPassword
        }
      });
  
      await newRestaurant.save();
  
      // Création du token JWT
      const token = jwt.sign(
        { id: newRestaurant._id, email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
  
      res.status(201).json({
        message: 'Restaurant et commerçant créés avec succès.',
        token,
        restaurantId: newRestaurant._id
      });
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
      res.status(500).json({ message: "Erreur serveur." });
    }
  });
  
// 1. Création d'un Restaurant (POST /restaurants)
router.post('/restaurants', async (req, res) => {
    const { name, menus, commercantInfo } = req.body;
    
    try {
        // Vérifier si le commerçant existe déjà (par email) dans le restaurant
        const existingRestaurant = await Restaurant.findOne({ 'commercantInfo.email': commercantInfo.email });
        if (existingRestaurant) {
            return res.status(400).json({ message: 'Ce commerçant possède déjà un restaurant avec cet email' });
        }

        // Hacher le mot de passe avant de l'enregistrer
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(commercantInfo.motDePasse, salt);

        // Créer un nouveau restaurant avec les informations du commerçant
        const newRestaurant = new Restaurant({
            name,
            menus,
            commercantInfo: {
                name: commercantInfo.name,
                email: commercantInfo.email,
                motDePasse: hashedPassword,
                photoDeProfil: commercantInfo.photoDeProfil || 'default-avatar.jpg',
                resetPasswordToken: commercantInfo.resetPasswordToken,
                resetPasswordExpires: commercantInfo.resetPasswordExpires
            }
        });

        // Enregistrer le restaurant
        await newRestaurant.save();

        res.status(201).json(newRestaurant);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// 2. Login (POST /login)
router.post('/login', async (req, res) => {
    const { email, motDePasse } = req.body;
    
    try {
        // Trouver un restaurant avec cet email dans commercantInfo
        const restaurant = await Restaurant.findOne({ 'commercantInfo.email': email });
        if (!restaurant) {
            return res.status(400).json({ message: 'Commerçant non trouvé' });
        }

        // Comparer le mot de passe envoyé avec celui stocké
        const isMatch = await bcrypt.compare(motDePasse, restaurant.commercantInfo.motDePasse);
        if (!isMatch) {
            return res.status(400).json({ message: 'Mot de passe incorrect' });
        }

        // Créer un token JWT
        const token = jwt.sign(
            { id: restaurant._id },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// 3. Register (POST /register)
router.post('/register', async (req, res) => {
    const { restaurantName, commercantName, email, motDePasse, photoDeProfil } = req.body;
    
    try {
        // Vérifier si le commerçant existe déjà par email dans le restaurant
        const existingRestaurant = await Restaurant.findOne({ 'commercantInfo.email': email });
        if (existingRestaurant) {
            return res.status(400).json({ message: 'Email déjà utilisé' });
        }

        // Hacher le mot de passe avant de l'enregistrer
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(motDePasse, salt);

        // Créer un restaurant avec les informations du commerçant
        const newRestaurant = new Restaurant({
            name: restaurantName,  // Nom du restaurant
            menu: [],  // Menu initial (vide)
            commercantInfo: {
                name: commercantName,  // Nom du commerçant
                email,
                motDePasse: hashedPassword,
                photoDeProfil: photoDeProfil || 'default-avatar.jpg',
                resetPasswordToken: null,
                resetPasswordExpires: null
            }
        });

        // Enregistrer le restaurant
        await newRestaurant.save();

        res.status(201).json({ message: 'Commerçant et restaurant créés avec succès' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});
router.get('/commercant/me', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]; // Extraire le token depuis l'en-tête
        if (!token) {
            return res.status(401).json({ message: 'Token manquant' });
        }

        const decoded = jwt.verify(token, JWT_SECRET); // Vérifier et décoder le token
        const restaurant = await Restaurant.findById(decoded.id); // Trouver le restaurant par l'ID du token
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant non trouvé' });
        }

        // Ajouter restaurantId à la réponse
        const commercantInfo = {
            name: restaurant.commercantInfo.name,
            email: restaurant.commercantInfo.email,
            photoDeProfil: restaurant.commercantInfo.photoDeProfil,
            restaurantId: restaurant._id  // Ajoutez ici le restaurantId
        };

        res.json(commercantInfo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});


// Exporter le router

// Récupérer les éléments du menu d'un restaurant
router.post('/:id/menu', async (req, res) => {
    const { id } = req.params;
    const { title, category, description, image, numberOfDishes, isActive, price } = req.body;

    try {
        // Trouver le restaurant par ID
        const restaurant = await Restaurant.findById(id);

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant non trouvé' });
        }

        // Ajouter un nouvel élément au menu
        const newMenuItem = {
            title,
            category,
            description,
            image,
            numberOfDishes,
            isActive,
            price
        };

        restaurant.menu.push(newMenuItem);

        // Sauvegarder les modifications dans la base de données
        await restaurant.save();

        res.status(200).json({ message: 'Élément ajouté au menu', restaurant });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de l\'ajout du menu', error });
    }
});
// Récupérer les éléments du menu d'un restaurant
router.get('/:id/menu', async (req, res) => {
    const { id } = req.params;

    try {
        // Trouver le restaurant par ID
        const restaurant = await Restaurant.findById(id);

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant non trouvé' });
        }

        // Retourner les éléments du menu
        res.status(200).json({ menu: restaurant.menu });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération du menu', error });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id).select('-commercantInfo.motDePasse -commercantInfo.resetPasswordToken -commercantInfo.resetPasswordExpires');
        
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant non trouvé' });
        }
        
        res.json(restaurant);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
});
// PUT /api/restaurants/:restaurantId/menu/:itemId
router.put('/:restaurantId/menu/:itemId', 
    upload.single('image'),
    validateMenuItem,
    async (req, res) => {
      try {
        const { restaurantId, itemId } = req.params;
        
        // 1. Trouver le restaurant
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
          return res.status(404).json({ success: false, message: "Restaurant non trouvé" });
        }

        // 2. Trouver le menu qui contient l'élément avec l'itemId
        let menuItem = null;
        for (let menu of restaurant.menus) {
          menuItem = menu.dishes.id(itemId);
          if (menuItem) break;  // Si l'item est trouvé, on sort de la boucle
        }
        
        if (!menuItem) {
          return res.status(404).json({ success: false, message: "Item de menu non trouvé" });
        }
  
        // 3. Mettre à jour les champs
        if (req.body.title) menuItem.title = req.body.title;
        if (req.body.price) menuItem.price = Number(req.body.price);
        if (req.body.description) menuItem.description = req.body.description;
        if (req.file) menuItem.image = '/uploads/' + req.file.filename;
  
        // 4. Valider avant sauvegarde
        try {
          await restaurant.validate();
        } catch (validationError) {
          return res.status(400).json({
            success: false,
            message: "Erreur de validation",
            errors: validationError.errors
          });
        }
  
        // 5. Sauvegarder
        await restaurant.save();
  
        res.json({
          success: true,
          data: menuItem
        });
  
      } catch (error) {
        console.error("Erreur serveur:", error);
        res.status(500).json({
          success: false,
          message: "Erreur serveur",
          error: error.message
        });
      }
    }
);


router.post('/menu/:restaurantId', async (req, res) => {
    const { restaurantId } = req.params;
    const { name, day, numberOfDishes, isActive, dishes } = req.body;

    try {
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant non trouvé' });
        }

        // Ajouter un nouveau menu avec ses plats
        const newMenu = {
            name,
            day,
            numberOfDishes,
            isActive,
            dishes // Tableau de plats [{title, description, price, image, category}]
        };

        restaurant.menus.push(newMenu);
        await restaurant.save();

        res.status(200).json({ message: 'Menu ajouté avec succès', restaurant });

    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
});
router.get('/:id/daily-menu', async (req, res) => {
    const { id } = req.params;
    const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long' }); // Ex: "Lundi"

    try {
        // Trouver le restaurant
        const restaurant = await Restaurant.findById(id);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant non trouvé' });
        }

        // Filtrer les menus actifs du jour
        const dailyMenus = restaurant.menus.filter(menu => menu.day === today && menu.isActive);

        // Si aucun plat n'est trouvé pour aujourd'hui, retourner une réponse avec une liste vide
        if (dailyMenus.length === 0) {
            return res.status(200).json({ message: `Aucun menu actif pour ${today}`, dailyMenus: [] });
        }

        res.status(200).json({ message: `Plats du jour pour ${today}`, dailyMenus });
    } catch (error) {
        console.error(error);  // Log de l'erreur pour faciliter le débogage côté serveur
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
});

router.patch('/:restaurantId/menus/:menuId/status', async (req, res) => {
    const { restaurantId, menuId } = req.params;
    const { isActive } = req.body;

    try {
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ success: false, message: "Restaurant non trouvé" });
        }

        const menu = restaurant.menus.id(menuId);
        if (!menu) {
            return res.status(404).json({ success: false, message: "Menu non trouvé" });
        }

        // Si on active un menu, désactiver tous les autres d'abord
        if (isActive) {
            restaurant.menus.forEach(m => {
                m.isActive = false;
            });
        }

        menu.isActive = isActive;
        await restaurant.save();

        res.status(200).json({ 
            success: true, 
            message: `Menu ${isActive ? "activé (autres menus désactivés)" : "désactivé"}`,
            data: menu 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
    }
});

router.post('/:restaurantId/menus', upload.single('image'), async (req, res) => {
    const { restaurantId } = req.params;
    const { name, day, dishes } = req.body;

    try {
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ success: false, message: "Restaurant non trouvé" });
        }

        // Validation du jour
        const days = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];
        if (!days.includes(day.toLowerCase())) {
            return res.status(400).json({ success: false, message: "Jour invalide" });
        }

        const newMenu = {
            name,
            day: day.toLowerCase(),
            dishes: dishes.map(dish => ({
                ...dish,
                price: Number(dish.price),
                image: dish.image || 'default-image.jpg'
            })),
            numberOfDishes: dishes.length,
            isActive: false // Désactivé par défaut (à activer manuellement)
        };

        restaurant.menus.push(newMenu);
        await restaurant.save();

        res.status(201).json({ success: true, data: newMenu });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
    }
});



router.post('/:restaurantId/menus/:menuId/dishes', upload.single('image'), validateMenuItem, async (req, res) => {
    const { restaurantId, menuId } = req.params;
    const { title, description, price, category } = req.body;

    try {
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ success: false, message: "Restaurant non trouvé" });
        }

        const menu = restaurant.menus.id(menuId);
        if (!menu) {
            return res.status(404).json({ success: false, message: "Menu non trouvé" });
        }

        const newDish = {
            title,
            description,
            price: Number(price),
            category,
            image: req.file ? '/uploads/' + req.file.filename : 'default-image.jpg'
        };

        menu.dishes.push(newDish);
        menu.numberOfDishes = menu.dishes.length; // Mise à jour du compteur
        await restaurant.save();

        res.status(201).json({ success: true, data: newDish });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
    }
});
 
module.exports = router;
