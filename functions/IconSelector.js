

export default IconSelector = (ingredient, icons) => {
    for (var i = 0; i < icons.length; i++) {
        if (ingredient.includes(icons[i])) {

            console.log(i)
            return `https://teoudovcic.com/Nutri-Scan/${icons[i]}.png`


        } else {
            return `https://teoudovcic.com/Nutri-Scan/other.png`

        }
    }
}
