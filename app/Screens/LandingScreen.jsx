import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Animated, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

const MarqueeComponent = ({ children, duration }) => {
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(translateX, {
        toValue: -1000,
        duration,
        useNativeDriver: true,
      })
    );
    animation.start();
    return () => animation.stop();
  }, [duration]);

  return (
    <View style={styles.marqueeContainer}>
      <Animated.View style={{ 
        flexDirection: 'row',
        transform: [{ translateX }]
      }}>
        {children}
        {children}
      </Animated.View>
    </View>
  );
};

export default function LandingScreen() {
  const images = [
    require('../../assets/images/landing 02 (1).jpeg'),
    require('../../assets/images/landing 02 (2).jpeg'),
    require('../../assets/images/landing 02 (3).jpeg'),
    require('../../assets/images/landing 02 (4).jpeg'),
    require('../../assets/images/Pasta.jpeg'),
    require('../../assets/images/salad.jpeg'),
    require('../../assets/images/burger.jpeg'),
    require('../../assets/images/pancake.jpeg'),
    require('../../assets/images/chicken.jpeg'),
    require('../../assets/images/chocolateCake.jpeg'),
    require('../../assets/images/landing 06.jpeg'),
    require('../../assets/images/landing 07.jpeg'),
  ];

  const router = useRouter();
  const extendedImages = [...images, ...images, ...images, ...images];

  const renderGridMarquee = () => {
    return (
      <View style={styles.gridContainer}>
        {[0, 1, 2].map((row) => (
          <MarqueeComponent key={row} duration={10000 + (row * 3000)}>
            {extendedImages.slice(row * 6, row * 6 + 12).map((img, index) => (
              <Image 
                key={`${row}-${index}`} 
                source={img} 
                style={styles.gridImage}
                resizeMode="cover"
              />
            ))}
          </MarqueeComponent>
        ))}
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {renderGridMarquee()}

      <View style={styles.textContainer}>
        <View style={styles.titleWrapper}>
          <Text style={styles.mainTitle}>MY RECIPES</Text>
          <Text style={styles.subTitle}>Find, Create & Enjoy Delicious Recipes!</Text>
        </View>

        <Text style={styles.description}>
          Generate delicious recipes in seconds with the power of AI! <Text style={styles.emoji}>🍔✨</Text>
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/Login/login')}>
        <Text style={styles.buttonText}>GET STARTED</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#262626',
    justifyContent: 'center',
  },
  textContainer: {
    marginVertical: 25,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  titleWrapper: {
    marginBottom: 20,
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFA500',
    fontFamily: 'outfit-bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  subTitle: {
    fontSize: 18,
    color: '#FFF',
    fontFamily: 'outfit-medium',
    textAlign: 'center',
    letterSpacing: 0.5,
    lineHeight: 24,
  },
  emoji: {
    fontSize: 20,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#DDD',
    marginBottom: 25,
    fontFamily: 'outfit',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  gridContainer: {
    width: '100%',
    height: '55%',
    marginBottom: 10,
  },
  marqueeContainer: {
    flexDirection: 'row',
    overflow: 'hidden',
    marginVertical: 15,
    height: 150,
  },
  gridImage: {
    width: 180,
    height: 150,
    borderRadius: 12,
    marginHorizontal: 12,
    borderWidth: 1,
    borderColor: '#444',
  },
  button: {
    backgroundColor: '#8B4513',
    paddingHorizontal: 50,
    paddingVertical: 16,
    borderRadius: 30,
    marginTop: 20,
    marginBottom: 30,
    minWidth: 220,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 18,
    fontFamily: 'outfit-medium',
    textAlign: 'center',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
