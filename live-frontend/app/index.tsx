import * as React from 'react';
import { useState, useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { useRouter } from 'expo-router';
import { 
  useFonts,
  Righteous_400Regular
} from '@expo-google-fonts/righteous';
import 'react-native-get-random-values';

const { width, height } = Dimensions.get('window');

// Example slides
const slides = [
  {
    id: '1',
    background: require('../assets/images/photo1.png'),
    tagline: 'Unforgettable moments made easy.',
  },
  {
    id: '2',
    background: require('../assets/images/photo2.png'),
    phone: require('../assets/images/appPhoto1.png'),
    tagline: 'Find your next adventure.',
  },
  {
    id: '3',
    background: require('../assets/images/photo1.png'),
    phone: require('../assets/images/appPhoto1.png'),
    tagline: 'Route options that never run out.',
  },
];

// Pagination component
function CustomPagination({ slides, activeIndex }: { slides: any[]; activeIndex: number }) {
  return (
    <View style={styles.paginationContainer}>
      {slides.map((_, i) => (
        <View
          key={i}
          style={i === activeIndex ? styles.activeDot : styles.inactiveDot}
        />
      ))}
    </View>
  );
}

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function Index() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const [fontsLoaded] = useFonts({
    Righteous_400Regular,
  });

  useEffect(() => {
    async function prepare() {
      try {
        // Keep the splash screen visible while we fetch resources
        await SplashScreen.preventAutoHideAsync();
      } catch (e) {
        console.warn(e);
      }
    }
    prepare();
  }, []);

  // Hide splash screen once fonts are loaded
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Return null if fonts haven't loaded
  if (!fontsLoaded) {
    return null;
  }

  const renderItem = ({ item }: { item: any }) => {
    return (
      <View style={styles.slide}>

        {/* Top portion (background) */}
        <View style={styles.backgroundContainer}>
          <Image source={item.background} style={styles.backgroundImage} />
        </View>

        {/* Content fills the entire screen (over the background) */}
        <View style={styles.contentWrapper}>

          {/* TOP SECTION: Brand name + phone image */}
          <View style={styles.topSection}>
            <Text style={styles.brandName}>Live</Text>

            {/* Phone container with image centered */}
            <View style={styles.phoneContainer}>
              <Image source={item.phone} style={styles.phoneImage} resizeMode="contain" />
            </View>
          </View>

          {/* BOTTOM SECTION: Tagline, Pagination, Buttons */}
          <View style={styles.bottomContainer}>
            <Text style={styles.tagline}>{item.tagline}</Text>
            <CustomPagination slides={slides} activeIndex={activeIndex} />

            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={styles.joinButton}
                onPress={() => router.push('/signup')}
              >
                <Text style={styles.joinButtonText}>Join for free</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.loginButton}
                onPress={() => router.push('/Experience')} //change to login
              >
                <Text style={styles.loginButtonText}>Log in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Carousel
        data={slides}
        renderItem={renderItem}
        width={width}
        height={height}
        onSnapToItem={(i) => setActiveIndex(i)}
        autoPlay={false}
        autoPlayInterval={3000}
      />
    </View>
  );
}

// STYLES
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  slide: {
    width,
    height,
  },

  // The top "background" portion occupies ~55% of the screen height
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '55%',
    overflow: 'hidden', // crop if needed
    zIndex: 1,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  // A wrapper that spans the entire slide for top & bottom sections
  contentWrapper: {
    flex: 1,
    zIndex: 2, // ensure content is above the background
  },

  // TOP SECTION
  topSection: {
    flex: 5, // 5 "parts" for top content
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: height * 0.06, // space for status bar, etc.
  },
  brandName: {
    fontSize: 48,
    fontFamily: 'Righteous_400Regular',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    marginBottom: 20,
  },
  phoneContainer: {
    width: width * 0.7,
    height: width * 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 'auto',
    marginBottom: 0,
  },
  phoneImage: {
    width: '100%',
    height: '100%',
    alignSelf: 'center',
  },

  // BOTTOM SECTION
  bottomContainer: {
    flex: 4, // 4 "parts" for bottom content
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  tagline: {
    fontSize: 20,
    color: '#000',
    textAlign: 'center',
    marginBottom: 15,
  },

  // Pagination dots
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'gray',
    marginHorizontal: 4,
  },
  inactiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },

  // Buttons inside bottom container
  buttonsContainer: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  joinButton: {
    backgroundColor: '#f15a24',
    width: '90%',
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 15,
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loginButton: {
    width: '90%',
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#f15a24',
  },
  loginButtonText: {
    color: '#f15a24',
    fontSize: 16,
    fontWeight: '600',
  },
});
