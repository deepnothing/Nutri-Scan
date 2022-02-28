import { View, Image, Text, StyleSheet, Dimensions, PixelRatio } from 'react-native';
import { useFonts } from 'expo-font';
import { useEffect, useState } from 'react';

const {
    width,
    height,
} = Dimensions.get('window');



const normalize = (size, multiplier = 2) => {
    const scale = (width / height) * multiplier;

    const newSize = size * scale;

    return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

export default function OtherIngredients(props) {
    const ingredientText = props.text.toLowerCase();
    const [icon, setIcon] = useState(`https://teoudovcic.com/Nutri-Scan/other.png`);

    useEffect(() => {
        for (var i = 0; i < props.icons.length; i++) {
            if (ingredientText.includes(props.icons[i])) {
                setIcon(`https://teoudovcic.com/Nutri-Scan/${props.icons[i]}.png`)

                break
            }
        }
    })

    const [fontLoaded] = useFonts({
        Bubblewump: require('../../assets/fonts/Bubblewump.ttf'),
        Melancholy: require('../../assets/fonts/Melancholy.otf')
    })

    if (!fontLoaded) {
        return null
    }

    //responsive icon image size if container under 10%
    const otherIconStyles = (size) => {
        return {
            width: size <= 9 ? width / 8 : width / 6,
            height: size <= 9 ? height / 17 : height / 13,
            marginRight: "3%",
        }
    }



    return (
        <View
            style={[styles.otheringredientStyle, { width: props.width }]}

        >
            <Text style={[styles.percentage, { fontSize: props.underZero <= 9 ? normalize(35) : normalize(45) }]}>
                {props.defaultIcon ?
                    props.underZero
                    :
                    Math.ceil(props.ingredient.percent_estimate * 10) / 10
                }%
            </Text>
            <Text style={[styles.ingredientLabel, { fontSize: props.underZero <= 9 ? normalize(20) : normalize(27) }]}>
                {props.text.toLowerCase()}
            </Text>

            <Image
                source={{
                    uri: props.defaultIcon ?
                        `https://teoudovcic.com/Nutri-Scan/other.png`
                        :
                        icon


                }}
                style={otherIconStyles(props.underZero)}
            />

        </View>
    )
}

const styles = StyleSheet.create({
    otheringredientStyle: {
        position: 'relative',
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

        backgroundColor: '#FF6347'
    },
    ingredientLabel: {
        width: 190,
        marginRight: 0,
        fontFamily: 'Bubblewump',
    },
    percentage: {

        marginLeft: 12,
        fontFamily: 'Melancholy',
    }
})