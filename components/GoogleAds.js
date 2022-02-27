import { SafeAreaView, StyleSheet } from 'react-native';
import { AdMobBanner } from 'expo-ads-admob';


export default function GoogleAds(props) {

    return (
        <SafeAreaView style={styles.adContainer}>
            <AdMobBanner
                bannerSize="banner"
                adUnitID="ca-app-pub-3184251687444573/7127944734" // admob-unit-id
                servePersonalizedAds={props.hasTrackingPermission ? true : false} // true or false
                onDidFailToReceiveAdWithError={this.bannerError}
            />
            <AdMobBanner
                bannerSize="banner"
                adUnitID="ca-app-pub-3184251687444573/8874735704" // admob-unit-id
                servePersonalizedAds={props.hasTrackingPermission ? true : false} // true or false
                onDidFailToReceiveAdWithError={this.bannerError}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    adContainer: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        backgroundColor: 'transparent',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

})