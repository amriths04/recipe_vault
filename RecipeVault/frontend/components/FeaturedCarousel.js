import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, Dimensions, ActivityIndicator } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { fetchRecipes } from "../services/recipeService"; // ✅ Make sure path is correct

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.9;
const CARD_HEIGHT = 189;

const FeaturedCarousel = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecipes = async () => {
      const result = await fetchRecipes();

      if (result && Array.isArray(result)) {
        setRecipes(result);
      } else {
        console.error("❌ Invalid Recipe Data:", result);
      }
      setLoading(false);
    };

    loadRecipes();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.slide}>
      <Image source={{ uri: item.image || "https://via.placeholder.com/400x200?text=No+Image" }} style={styles.image} />
      <View style={styles.overlay}>
        <Text style={styles.title}>{item.name || "Untitled Recipe"}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Loading Featured Recipes...</Text>
      </View>
    );
  }

  if (!recipes.length) {
    return (
      <View style={styles.loadingContainer}>
        <Text>No recipes found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.carouselContainer}>
      <Carousel
        width={CARD_WIDTH}
        height={CARD_HEIGHT}
        data={recipes}
        renderItem={renderItem}
        loop
        autoPlay
        autoPlayInterval={3000}
        scrollAnimationDuration={1000}
        pagingEnabled
        snapEnabled
      />
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    width: CARD_WIDTH,
    alignItems: "center",
  },
  slide: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 5,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    paddingVertical: 10,
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: CARD_HEIGHT,
    marginVertical: 20,
  },
});

export default FeaturedCarousel;
