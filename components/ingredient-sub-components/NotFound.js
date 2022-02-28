import { View, Image, Text, StyleSheet, Dimensions, PixelRatio } from 'react-native';
import { useFonts } from 'expo-font';
import GoogleAds from '../GoogleAds';
const {
    width,
    height,
} = Dimensions.get('window');


const normalize = (size, multiplier = 2) => {
    const scale = (width / height) * multiplier;

    const newSize = size * scale;

    return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

export default function NotFound(props) {

    const [fontLoaded] = useFonts({
        Bubblewump: require('../../assets/fonts/Bubblewump.ttf'),
    })

    if (!fontLoaded) {
        return null
    }

    return (
        <>
            <GoogleAds
                hasTrackingPermission={props.hasTrackingPermission}
            />
            <View style={styles.container}
                onTouchStart={() => props.touchStart(false)}
                onTouchEnd={() => props.touchEnd(true)}
            >


                <Image
                    style={styles.image}
                    source={require('../../assets/system-icons/unknown.png')} />

                <Text style={styles.disclaimer}>
                    {"Sorry  :(\n this poduct isn't in our food files"}
                </Text>

            </View>
        </>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    image: {
        height: height / 6,
        width: width / 2.6,
        marginBottom: "20%"

    },
    disclaimer: {
        fontFamily: 'Bubblewump',
        textAlign: 'center',
        lineHeight: 40,
        fontSize: normalize(27),
        marginTop: "10%"
    },

})