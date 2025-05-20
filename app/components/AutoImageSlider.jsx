import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Slideshow from "react-native-image-slider-show";

const { width } = Dimensions.get("window");

const dataSource = [
  { url: require("../../assets/images/Banner 01.jpeg") },
  { url: require("../../assets/images/Banner 30.jpeg") },
  { url: require("../../assets/images/banner 05.jpeg") },
  { url: require("../../assets/images/banner 11.jpeg") },
  { url: require("../../assets/images/banner 16.jpeg") },
];

const ImageSlider = () => {
  const [position, setPosition] = useState(0);

  useEffect(() => {
    const toggle = setInterval(() => {
      setPosition((prev) => (prev === dataSource.length - 1 ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(toggle);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.sliderWrapper}>
        {" "}
        {/* Wrapper for height control */}
        <Slideshow
          position={position}
          dataSource={dataSource}
          containerStyle={styles.sliderContainer} // Adjust slider position
          imageStyle={styles.imageStyle} // Adjust image size
          arrowStyle={styles.arrowStyle} // Customize arrows
          dotStyle={styles.dotStyle} // Customize dots
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center", // Center horizontally
    top: 60, // Adjust top margin
    marginBottom: 0,
    position: "absolute",
  },
  sliderWrapper: {
    width: width * 1, // Set width to 100% of screen
    height: 200, // Reduced height to 150
    overflow: "hidden", // Hide any overflowed content
  },
  sliderContainer: {
    width: "100%", // Set width to 100% of the wrapper
    height: "100%", // Set height to 100% of the wrapper
  },
  imageStyle: {
    width: "100%", // Full width of slider
    height: "100%", // Full height of slider
    resizeMode: "cover", // Cover the area properly
  },
  arrowStyle: {
    tintColor:  "#b33c00", // Change the color of the arrows (e.g., tomato red)
  },
  dotStyle: {
    backgroundColor:  "#b33c00", // Change the color of the active dot (e.g., tomato red)
  },
});

export default ImageSlider;
