import Ingredient from "../models/ingredientModel.js";

// Add Ingredient
export const addIngredient = async (req, res) => {
  const { name, unit, pricePerUnit } = req.body;
  try {
    const ingredient = new Ingredient({ name, unit, pricePerUnit });
    await ingredient.save();
    res.status(201).json(ingredient);
  } catch (error) {
    res.status(500).json({ message: "Error adding ingredient", error });
  }
};

// Get All
export const getAllIngredients = async (req, res) => {
  try {
    const ingredients = await Ingredient.find();
    res.json(ingredients);
  } catch (error) {
    res.status(500).json({ message: "Error fetching ingredients", error });
  }
};

// Delete
export const deleteIngredient = async (req, res) => {
  try {
    await Ingredient.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting ingredient", error });
  }
};

// Update
export const updateIngredient = async (req, res) => {
  const { name, unit, pricePerUnit } = req.body;
  try {
    const updated = await Ingredient.findByIdAndUpdate(
      req.params.id,
      { name, unit, pricePerUnit },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating ingredient", error });
  }
};

// Calculate Price
export const calculatePrice = async (req, res) => {
    const { ingredients } = req.body;
  
    try {
      let total = 0;
      const detailedItems = [];
  
      for (const item of ingredients) {
        const ingredient = await Ingredient.findOne({ name: item.name });
  
        if (!ingredient) {
          return res.status(404).json({ message: `Ingredient not found: ${item.name}` });
        }
  
        // Parse quantity string
        const match = item.quantity.match(/^([\d.\/]+)\s*(\w+)?$/);
        if (!match) {
          return res.status(400).json({ message: `Invalid quantity format: ${item.quantity}` });
        }
  
        let [ , rawAmount ] = match;
        let amount = eval(rawAmount); // handles fractions like "1/2"
        const price = amount * ingredient.pricePerUnit;
        total += price;
  
        detailedItems.push({
          name: item.name,
          quantity: item.quantity,
          unit: ingredient.unit,
          pricePerUnit: ingredient.pricePerUnit,
          price,
        });
      }
  
      res.json({ items: detailedItems, totalPrice: total });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Error calculating price", error });
    }
  };