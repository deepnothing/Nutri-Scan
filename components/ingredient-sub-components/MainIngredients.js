import { View, Text, Image, StyleSheet, Dimensions, PixelRatio } from "react-native"
import { useEffect, useState } from 'react';
import ImageColors from 'react-native-image-colors'
const {
    width,
    height,
} = Dimensions.get('window');


const normalize = (size, multiplier = 2) => {
    const scale = (width / height) * multiplier;

    const newSize = size * scale;

    return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

export default function MainIngredients(props) {
    const [backgroundColor, setBackgroundColor] = useState('#EE9A0F');
    const [icon, setIcon] = useState('https://teoudovcic.com/Nutri-Scan/other.png')
    const ingredientText = props.ingredient.text.toLowerCase();

    //extract color form server icon
    async function fetchColors(image) {
        const result = await ImageColors.getColors(image).catch(error => console.log(error))
        if (result?.platform === 'ios') {
            setBackgroundColor(result.background)
        } else if (result?.platform === 'android') {
            setBackgroundColor(result.vibrant)
        }
    }

    useEffect(() => {

        for (var i = 0; i < props.icons.length; i++) {
            if (ingredientText.includes(props.icons[i])) {

                fetchColors(`https://teoudovcic.com/Nutri-Scan/${props.icons[i]}.png`)

                setIcon(`https://teoudovcic.com/Nutri-Scan/${props.icons[i]}.png`)

                break
            }
        }

    })

    //responsive text color to contrast with light/dark background
    const getColorByBgColor = (bgColor) => {
        if (!bgColor) { return ''; }
        return (parseInt(bgColor.replace('#', ''), 16) > 0xffffff / 2) ? '#000' : '#fff';
    }


    //responsive ingredient height to percentage of screen
    const ingredientStyle = (percent) => {

        return {
            height: `${percent}%`,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        }
    }


    return (
        <View
            style={[ingredientStyle(Math.floor(props.ingredient.percent_estimate)), { backgroundColor: backgroundColor }]}
            onTouchStart={() => props.touchStart(false)}
            onTouchEnd={() => props.touchEnd(true)}

        >
            <Text style={[styles.percentage, { color: getColorByBgColor(backgroundColor) }]} >

                {Math.floor(props.ingredient.percent_estimate) + '%'}

            </Text>
            <Text style={[styles.ingredientLabel, { color: getColorByBgColor(backgroundColor) }]}>
                {ingredientText}
            </Text>


            {
                //add padding under last child in case total percentage is slightly under 100

                props.isLastChild ?
                    <View style={[styles.padded, { backgroundColor: backgroundColor }]}>
                    </View>
                    :
                    null
            }
            <Image
                source={{ uri: icon }}
                style={styles.iconStyles}
            />


        </View>
    )
}

const styles = StyleSheet.create({
    ingredientLabel: {
        fontSize: normalize(27),
        marginRight: 0,
        width: width / 2.5,
        fontFamily: 'Bubblewump',
    },
    percentage: {
        fontSize: normalize(47),
        marginLeft: 12,
        fontFamily: 'Melancholy',

    },
    iconStyles: {
        width: width / 6,
        height: height / 13,
        marginRight: "3%",


    },
    padded: {

        position: 'absolute',
        width: '100%',
        bottom: '-100%',
        height: '100%',

    }
})