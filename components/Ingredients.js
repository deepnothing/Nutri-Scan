import { View, StyleSheet, SafeAreaView, Image, Dimensions, } from 'react-native';
import { useFonts } from 'expo-font';
import { useEffect, useState } from 'react';
import SlidingView from '@deepnothing/rn-sliding-view';
import ViewSlider from './view-slider-carousel/index';
import NotFound from './ingredient-sub-components/NotFound';
import NoIngredients from './ingredient-sub-components/NoIngredients';
import MainIngredients from './ingredient-sub-components/MainIngredients';
import OtherIngredients from './ingredient-sub-components/OtherIngredients';

const { width } = Dimensions.get('window');


export default function Ingredients(props) {

    const [ingredientsAPI, setIngredientsAPI] = useState();
    const [mainCardDrag, setMainCardDrag] = useState(true);
    const [icons, setIcons] = useState([]);
    const [totalPercentage, setTotalPercentage] = useState();

    //get server icons
    async function fetchIcons() {
        if (props.data?.product?.ingredients) {
            fetch('http://teoudovcic.com/icons.php')
                .then(res => res.json())
                .then(resdata => { setIcons(resdata.reverse()) })
                .catch(err => console.log(err))
        }
    }

    useEffect(() => {
        let apiData = props.data?.product?.ingredients
        apiData?.sort((a, b) => b.percent_estimate - a.percent_estimate).reverse();
        setIngredientsAPI(apiData);
        fetchIcons();

        let total = 0;
        apiData?.map((i) => {
            total += i.percent_estimate
        })
        setTotalPercentage(total);

    }, [props.data?.product?.ingredients])


    //import fonts
    const [fontLoaded] = useFonts({
        Bubblewump: require('../assets/fonts/Bubblewump.ttf'),
        Melancholy: require('../assets/fonts/Melancholy.otf')
    })

    if (!fontLoaded) {
        return null
    }


    //element height percentage for all ingredients under 10% added up 
    let underZero = 0;

    //element height percentage for all ingredients over 10% added up 
    let overTen = 0;

    //ingredients under 10% container
    let otherCount = [];

    //ingredients over 10% container
    let mainCount = [];



    return (

        //main sliding container
        <SlidingView
            position="right"
            componentVisible={props.scanned}
            changeVisibilityCallback={() => { props.return(false); underZero = 0; otherCount = [] }}
            containerStyle={styles.slidingViewStyles}
            disableDrag={mainCardDrag}

        >
            <SafeAreaView
            //render under phone camera bezzle if it exists
            />

            <View style={styles.closeTab}
                //slide THIS element to remove main card and return to home screen 
                onTouchStart={() => setMainCardDrag(false)}
                onTouchEnd={() => setMainCardDrag(true)}
            >
                <Image
                    source={require('../assets/system-icons/caret.png')}
                    style={styles.closeIcon}
                />
            </View>

            {
                // if product not found 
                props.data?.status === 0 ?

                    <NotFound
                        hasTrackingPermission={props.hasTrackingPermission}
                        touchStart={setMainCardDrag}
                        touchEnd={setMainCardDrag}
                    />


                    :
                    //if product is found
                    <>
                        {
                            //if product contains readable ingredients 
                            props.data?.product.ingredients ?

                                <View>
                                    {
                                        //filter API response into ingredients under 10% from those over 10%

                                        ingredientsAPI?.map((i) => {

                                            if (Math.floor(i.percent_estimate) < 10) {

                                                //check if ingredient total is over %110, if it is, remove subingredients from under 10% values
                                                if (totalPercentage < 110) {

                                                    underZero += Math.floor(i.percent_estimate)
                                                    otherCount.push(i);
                                                } else {
                                                    if (!i?.has_sub_ingredients) {
                                                        underZero += Math.floor(i.percent_estimate)
                                                        otherCount.push(i);
                                                    }
                                                }
                                            } else {
                                                //check if ingredient total is over %110, if it is, remove subingredients from over 10% values

                                                if (totalPercentage < 110) {
                                                    overTen += Math.floor(i.percent_estimate)
                                                    mainCount.push(i)
                                                } else {
                                                    if (!i?.has_sub_ingredients) {
                                                        overTen += Math.floor(i.percent_estimate)
                                                        mainCount.push(i)
                                                    }
                                                }
                                            }

                                        })
                                    }
                                    {
                                        //carousel view for under 10% ingredients
                                        <ViewSlider
                                            style={styles.slider}
                                            height={`${underZero}%`}
                                            slideCount={otherCount.length + 1}
                                            dots={true} //allow pagination dots
                                            dotActiveColor='#fff'
                                            dotInactiveColor='#000'
                                            dotsContainerStyle={styles.dotContainer}
                                            autoSlide={false}
                                            renderSlides={

                                                <>
                                                    {/* //first slide of other ingredients is a label */}
                                                    <OtherIngredients
                                                        text={"other (swipe left)"}
                                                        underZero={underZero}
                                                        width={width}
                                                        icons={icons}
                                                        defaultIcon={true}
                                                    />
                                                    {
                                                        //loop through ingredients under 10%
                                                        otherCount?.reverse().map((o, index) => {

                                                            return (
                                                                <OtherIngredients
                                                                    text={o.text}
                                                                    underZero={underZero}
                                                                    key={index}
                                                                    ingredient={o}
                                                                    width={width}
                                                                    icons={icons}
                                                                    defaultIcon={false}
                                                                />
                                                            )
                                                        })
                                                    }
                                                </>
                                            }
                                        />

                                    }

                                    {

                                        mainCount?.map((i, index, arr) => {

                                            return props.scanned ?

                                                <MainIngredients
                                                    ingredient={i}
                                                    icons={icons}
                                                    key={index}
                                                    isLastChild={arr.length - 1 === index ? true : false}
                                                    touchStart={setMainCardDrag}
                                                    touchEnd={setMainCardDrag}
                                                />
                                                :
                                                null
                                        })
                                    }



                                </View>

                                :
                                //if product found but does not contain readable ingredients
                                <NoIngredients
                                    hasTrackingPermission={props.hasTrackingPermission}
                                    touchStart={setMainCardDrag}
                                    touchEnd={setMainCardDrag}
                                />
                        }
                    </>
            }

        </SlidingView>

    )
}

const styles = StyleSheet.create({

    closeTab: {
        position: 'absolute',
        height: 70,
        width: 32,
        top: 420,
        zIndex: 3,
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#cccccc',
        borderTopRightRadius: 10,
        backgroundColor: 'rgba(0,0,0,.1)',
        borderBottomRightRadius: 10
    }
    , closeIcon: {
        height: 40,
        width: 17,
        left: 5,
        opacity: 0.8

    },

    viewBox: {
        paddingHorizontal: 20,
        justifyContent: 'center',
        width: width,
        padding: 10,
        alignItems: 'center',
        height: 150
    },
    slider: {
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FF6347',
        zIndex: 4
    },
    dotContainer: {
        position: 'absolute',

        bottom: -15,
    },
    slidingViewStyles: {
        borderBottomLeftRadius: 30,
        borderTopLeftRadius: 30,
        zIndex: 4,
    },


});