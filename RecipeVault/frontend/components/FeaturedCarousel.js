import React from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import Carousel from "react-native-reanimated-carousel";

const { width } = Dimensions.get("window");

const CARD_WIDTH = width*0.9; // Full width for full visibility
const CARD_HEIGHT = 189; // Keeps images clear and visible

const dummyData = [
  { id: "1", title: "Delicious Pasta 🍝", image: "https://imgs.search.brave.com/Oh3NnTmWsvFKSYoS1kNmViSDANxirxNevvvAMoWHmDM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by90cmFkaXRpb25h/bC1pdGFsaWFuLXBl/bm5lLXBhc3RhLXdp/dGgtYm9sb2duZXNl/LXNhdWNlLWZyZXNo/LWJhc2lsLWJsYWNr/LWJhY2tncm91bmQt/c2lkZS12aWV3LWNs/b3NlLXVwXzE2NjEx/Ni00MzQ1LmpwZz9z/ZW10PWFpc19oeWJy/aWQ" },
  { id: "2", title: "Tasty Burger 🍔", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1998&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { id: "3", title: "Healthy Salad 🥗", image: "https://img.freepik.com/free-photo/salad-bowl-wooden-table_1150-21405.jpg?t=st=1739248700~exp=1739252300~hmac=d79346801caccb9f8ecbdd199d0e7cd0fb58f08032d893240c3f4c37f805e305&w=1380" },
];

const FeaturedCarousel = () => {
  const renderItem = ({ item }) => (
    <View style={styles.slide}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.overlay}>
        <Text style={styles.title}>{item.title}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.carouselContainer}>
      <Carousel
        width={CARD_WIDTH}
        height={CARD_HEIGHT}
        data={dummyData}
        renderItem={renderItem}
        loop
        autoPlay
        autoPlayInterval={3000}
        scrollAnimationDuration={1000}
        pagingEnabled // Ensures only one slide is visible at a time
        snapEnabled // Makes sure each slide properly snaps into place
      />
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    width: CARD_WIDTH, // Ensures full width for visibility
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
    resizeMode: "cover", // Ensures full image coverage
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
});

export default FeaturedCarousel;
