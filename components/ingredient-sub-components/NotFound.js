import { View, Image, Text, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import GoogleAds from '../GoogleAds';

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
        height: 200,
        width: 200,
        marginBottom: 50

    },
    disclaimer: {
        fontFamily: 'Bubblewump',
        textAlign: 'center',
        lineHeight: 40,
        fontSize: 28,
        marginTop: 30
    },
    adMobTop: {
        position: 'absolute',
        top: 50
    },
    adMobBottom: {
        position: 'absolute',
        bottom: 20
    }
})