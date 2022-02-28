import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, StatusBar, Image, ActivityIndicator, TouchableOpacity, PixelRatio, Dimensions } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';
import Ingredients from './components/Ingredients';
import { useFonts } from 'expo-font';
import { useNetInfo } from "@react-native-community/netinfo";
import GoogleAds from './components/GoogleAds';


const {
  width,
  height,
} = Dimensions.get('window');


const normalize = (size, multiplier = 2) => {
  const scale = (width / height) * multiplier;

  const newSize = size * scale;

  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

export default function App() {

  //import system fonts
  const [fontLoaded] = useFonts({
    Bubblewump: require('./assets/fonts/Bubblewump.ttf'),
    Melancholy: require('./assets/fonts/Melancholy.otf')
  })
  const [hasPermission, setHasPermission] = useState(null);
  const [hasTrackingPermission, setHasTrackingPermission] = useState(true);
  const [scanned, setScanned] = useState(false);
  const [ingredients, setIngredients] = useState();
  const [error, setError] = useState();
  const [infoVisibility, setInfoVisibility] = useState(true)

  //check if device has an internet connection
  const netInfo = useNetInfo();

  useEffect(() => {
    //request permission to use camera
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
    //request google ads tracking permission
    (async () => {
      const { status } = await requestTrackingPermissionsAsync();
      if (status === 'denied') {
        setHasTrackingPermission(false)
      }
    })();

  }, []);


  //scan function called when barcode is found 

  const handleBarCodeScanned = ({ type, data }) => {

    if (netInfo?.isConnected && !infoVisibility) {

      //fetch ingredients from API
      fetch(`https://world.openfoodfacts.org/api/v0/product/${data}.json`)
        .then(res => res.json())
        .then(data => {
          setIngredients(data);
          setScanned(true);
        })
        .catch((err) => setError(err))

    }
  };

  //camera permission handling 
  if (hasPermission === null) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          Requesting camera permission
        </Text>
      </View>
    )
  }
  if (hasPermission === false) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          No access to camera
        </Text>
        <Text>&nbsp;</Text>
        <Image
          style={styles.icon}
          source={require('./assets/system-icons/sad.png')}
        />
      </View>
    )
  }

  if (!fontLoaded) {
    return null
  }



  return (
    <>



      <View style={styles.mainWrapper}>


        <StatusBar barStyle={scanned ? "dark-content" : "light-content"} />

        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />

        <View style={styles.container}>

          {!scanned ?
            < GoogleAds
              hasTrackingPermission={hasTrackingPermission}
            />
            :
            null
          }

          <Text style={styles.errorMessage}>
            {error}
          </Text>

          <ActivityIndicator
            size="large"
            animating={scanned}
            style={styles.activityIndicator}
            color="#FFF"
          />
          <Image
            source={require('./assets/system-icons/scanner.png')}
            style={styles.scanner}
          />
          {netInfo?.isConnected ?
            <View style={styles.instructions}>
              {infoVisibility ?
                <View style={styles.infoContainer}>
                  <Image
                    source={require('./assets/system-icons/triangle.png')}
                    style={styles.chatBubble}
                  />
                  <View style={styles.infoTextWrapper}>
                    <Text style={styles.infoMessage}>
                      🥫
                    </Text>
                    <Text style={styles.infoMessage}>
                      Grab any food item with a barcode to begin.
                    </Text>
                  </View>
                  <View style={styles.infoTextWrapper}>
                    <Text style={styles.infoMessage}>
                      💡
                    </Text>
                    <Text style={styles.infoMessage}>
                      Make sure barcode is clean and in a well lit area.
                    </Text>
                  </View>
                  <View style={styles.infoTextWrapper}>
                    <Text style={styles.infoMessage}>
                      🤓
                    </Text>
                    <Text style={styles.infoMessage}>
                      All ingredients are rounded to the nearest whole number.
                    </Text>
                  </View>
                  <View style={styles.infoTextWrapper}>
                    <Text style={styles.infoMessage}>
                      ☝️
                    </Text>
                    <Text style={styles.infoMessage}>
                      Ingredients under 10% are placed in the swipable tab labeled "other".
                    </Text>
                  </View>
                  <View style={styles.infoTextWrapper}>

                    <Text style={styles.infoMessage}>
                      💯
                    </Text>
                    <Text style={styles.infoMessage}>
                      Items with ingredients totaling over 100% will have sub-ingredients removed.
                    </Text>
                  </View>
                  <View style={styles.infoTextWrapper}>
                    <Text style={styles.infoMessage}>
                      ℹ️
                    </Text>
                    <Text style={styles.infoMessage}>
                      Tap the blue information icon below to close this message and begin scanning!
                    </Text>
                  </View>

                </View>
                : null
              }
              <TouchableOpacity onPress={() => setInfoVisibility(!infoVisibility)}>
                <Image
                  source={require('./assets/system-icons/information.png')}
                  style={styles.infoIcon}
                />
              </TouchableOpacity>
              <Text style={styles.prompt}>
                Scan   something   yummy
              </Text>
              <Image
                source={require('./assets/system-icons/yummy.png')}
                style={styles.icon}
              />
            </View>
            :
            <View style={styles.instructions}>
              <Image
                source={require('./assets/system-icons/wifi.png')}
                style={styles.icon} />
              <Text style={styles.noInternet}>
                No internet
              </Text>
              <Image
                source={require('./assets/system-icons/sad.png')}
                style={styles.icon} />
            </View>
          }

        </View>
        <Ingredients
          data={ingredients}
          return={setScanned}
          scanned={scanned}
          hasTrackingPermission={hasTrackingPermission}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  instructions: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    top: "20%",
    backgroundColor: 'rgba(0,0,0,0.3)',
    width: '100%',
    height: "10%",
  },
  adMobTop: {
    position: 'absolute',
    top: 0,
  },
  noInternet: {
    color: '#fff',
    fontFamily: 'Bubblewump',
    marginLeft: 20,
    marginRight: 20,
    fontSize: normalize(26)
  },
  prompt: {
    color: '#fff',
    fontFamily: 'Bubblewump',
    marginLeft: 20,
    marginRight: 20,
    fontSize: normalize(26)
  },
  icon: {
    width: width / 6.8,
    height: height / 14.7
  },
  infoTextWrapper: {
    display: 'flex',
    flexDirection: 'row'
  },
  mainWrapper: {
    height: '100%',
    zIndex: 1
  },
  scanner: {
    height: "30%",
    width: "90%",
    top: "3%"
  },
  errorMessage: {
    position: 'absolute',
    color: '#FFF'
  },
  activityIndicator: {
    position: 'absolute'
  },
  infoContainer: {
    position: 'absolute',
    backgroundColor: '#FFF',
    height: height / 2.24,
    width: "95%",
    bottom: "95%",
    paddingTop: "2%",
    paddingBottom: "2%",
    paddingLeft: "3.5%",
    paddingRight: "9%",
    borderRadius: 20,
    display: 'flex',
    justifyContent: 'space-evenly',
  },

  infoMessage: {
    fontSize: normalize(17),
    fontWeight: '700',
  },

  chatBubble: {
    position: 'absolute',
    height: height / 28,
    width: width / 15,
    left: "0.7%",
    top: "98.7%"
  },
  infoIcon: {
    height: height / 26,
    width: width / 12
  },
  permissionContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#FF6347"
  },
  permissionText: {
    fontSize: 15,
    fontWeight: 'bold'
  }


});
