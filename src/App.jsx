import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'

import NavBar from './Components/NavBar'
import Header from './Components/Header'

import SusColorsButton from './Components/SusColorsButton'
import SusColorBoxes from './Components/SusColorBoxes'

import ColorSectionHeader from './Components/ColorSectionHeader'
import ColorBoxes from './Components/ColorBoxes'
import PredictionMessages from './Components/PredictionMessages'

import FavoriteColorButtons from './Components/FavoriteColorButtons'
import FavoriteColorBoxes from './Components/FavoriteColorBoxes'

//Choose a random color by generating random RGB values.
function assignRandomColor() {
  return {
    red: Math.floor(Math.random() * 255),
    green: Math.floor(Math.random() * 255),
    blue: Math.floor(Math.random() * 255),
  }
}
//Convert a color object in the form {red: , green:, blue: } to a hex code.
function convertColorToHex(color) {
  const redString = Math.round(color.red) > 15 ? Math.round(color.red).toString(16) : '0' + Math.round(color.red).toString(16)
  const greenString = Math.round(color.green) > 15 ? Math.round(color.green).toString(16) : '0' + Math.round(color.green).toString(16)
  const blueString = Math.round(color.blue) > 15 ? Math.round(color.blue).toString(16) : '0' + Math.round(color.blue).toString(16)
  return ('#' + redString + greenString + blueString)
}

//Calculate the Euclidean distance between two given colors.
function distanceBetweenColors(color1, color2) {
  return Math.sqrt((color1.red - color2.red)**2 + (color1.green - color2.green)**2 + (color1.blue - color2.blue)**2)
}

//Calculate the brightness (luminosity) of a given color.
function calcBrightness(color) {
  return Math.round((2*color.red + 3*color.green + color.blue) / 6)
}

//Play sound effects
async function playSound(url) {
  const soundEffect = await new Audio(url)
  soundEffect.volume = 0.4
  soundEffect.play();
}

//Initialize constants.
const displayedColors = [assignRandomColor(), assignRandomColor()]
const hex = [convertColorToHex(displayedColors[0]), convertColorToHex(displayedColors[1])]

const avgDistance = [{pro: 0, con: 0}, {pro: 0, con:0}], likeabilityScore = [0, 0], avgLocalDistance = [{pro: 0, con: 0}, {pro: 0, con:0}]
const colorChoices = [], favoriteColors = [], leastFavoriteColors = []

const proChoices = [], conChoices = []

const predictionTypes = ['Euclidean', 'likeability', 'local Euclidean']
const prediction = [2, 2, 2], correctPredictions = [0, 0, 0], counter = [0, 0, 0], predictionMessage = ['', 'I will not make a prediction until you have chosen 16 colors.', '']
const predictionSuccessRate = [0, 0, 0], predictionSuccessMessage = ['', 'I have not yet attempted any predictions.', '']
let euclideanDistance = distanceBetweenColors(displayedColors[0], displayedColors[1])

const susProChoices = [], susConChoices = []
const likeabilityOfProColors = [], likeabilityOfConColors = []

const colorNodes = [], tempBlue = [], tempGreen = []
const log8 = Math.log(8)

const predictionAnimation = [
  {transform: 'rotate(0) scale(1)'},
  {transform: 'rotate(8deg) scale(1)'},
  {transform: 'rotate(-8deg) scale(1)'},
  {transform: 'rotate(0) scale(1)'}
];

const predictionAnimation2 = [
  {transform: 'rotate(0) scale(1)'},
  {transform: 'rotate(2deg) scale(1.04)'},
  {transform: 'rotate(-2deg) scale(0.96)'},
  {transform: 'rotate(0) scale(1)'}
];

const predictionAnimationTiming = {
  duration: 384,
  iterations: 1.5,
  fill: 'forwards'
}

//Initialize color nodes
function initializeColorNodes() {
  for (let i = 0; i < 256; i++) {
    for (let j = 0; j < 256; j++) {
      for (let k = 0; k < 256; k++) {
        tempBlue[k] = false
      }
      tempGreen[j] = [...tempBlue]
    }
    colorNodes[i] = [...tempGreen]
  }
  // console.log('colorNodes = ', colorNodes)
}
initializeColorNodes()

function App() {

  //Initialize state variables.
  const [styles, setStyles] = useState([{backgroundColor: hex[0]}, {backgroundColor: hex[1]}])
  const [newRows, setNewRows] = useState([{x1: 0, y1: 0, z1: 0, x2: 0, y2: 0, z2: 0}])
  const [favoritesStyles, setFavoritesStyles] = useState([])
  const [leastFavoritesStyles, setLeastFavoritesStyles] = useState([])
  const [susProChoiceStyles, setSusProChoiceStyles] = useState([])
  const [susConChoiceStyles, setSusConChoiceStyles] = useState([])
  const [h1Styles, setH1Styles] = useState({color: '#000000'})
  const [h2Styles, setH2Styles] = useState({color: '#000000'})
  const [headerStyles, setHeaderStyles] = useState({backgroundColor: '#ffffff'})
  const [buttonStyles, setButtonStyles] = useState({backgroundColor: '#f5f5f5'})
  const [navStyles, setNavStyles] = useState({backgroundColor: '#ffffff'})
  const [colorSectionHeaderStyles, setColorSectionHeaderStyles] = useState({backgroundColor: '#ffffff'})
  const [mainStyles, setMainStyles] = useState({backgroundColor: '#ffffff'})
  const [susStyles, setSusStyles] = useState({backgroundColor: '#ffffff'})
  const [colorSectionStyles, setColorSectionStyles] = useState({backgroundColor: '#ffffff'})
  const [favoriteH3Styles, setFavoriteH3Styles] = useState({color: '#000000'})
  const [favoriteH5Styles, setFavoriteH5Styles] = useState({color: '#000000'})
  const [leastFavoriteH3Styles, setLeastFavoriteH3Styles] = useState({color: '#000000'})
  const [muted, setMuted] = useState(true)
  
  //Toggle the muted audio option when the user clicks the audio icon.
  function handleAudioClick () {
    setMuted(prevMuted => !prevMuted)
  } 

  //Calculate the average distance of a given color from the user's pro and con choices.
  function avgDistanceFromChoices(color, preferred, criteria) {
    const totalDistance = colorChoices.reduce((distance, currentItem) => {
        if (preferred && distanceBetweenColors(currentItem.pro, color) < criteria) {return (distance + distanceBetweenColors(currentItem.pro, color))}
        else if (distanceBetweenColors(currentItem.pro, color) < criteria) {return (distance + distanceBetweenColors(currentItem.con, color))}
        else {return distance}
    }, 0)
    return Math.round(totalDistance / colorChoices.length)
  }

  //Calculate the user's likeability score of a particular color.
  function calcLikeability(color) {
    let likeability = 0
    function likeabilityMeasure(x, y) { return (distanceBetweenColors(x, y)**2 + 2)}

    likeability += proChoices.reduce((runningTotal, currentItem) => {
      return (runningTotal + 1/likeabilityMeasure(currentItem, color))
      }, 0)
    likeability -= conChoices.reduce((runningTotal, currentItem) => {
      return (runningTotal + 1/likeabilityMeasure(currentItem, color))
      }, 0)
    return Math.round(1000000 * likeability / (proChoices.length + conChoices.length))
  }

  function lightenColor(color, lighteningFactor) {
    return (convertColorToHex({
      red: color.red + Math.round((1 - lighteningFactor) * (255 - color.red)),
      green: color.green + Math.round((1 - lighteningFactor) * (255 - color.green)),
      blue: color.blue + Math.round((1 - lighteningFactor) * (255 - color.blue))
    }))
  }

  //Choose the user's favorite colors.
  function chooseFavoriteColors(precision, divNum) {
    const startTime = new Date().getTime()
    const likeabilityOfFavoriteColors = []
    const likeabilityOfLeastFavoriteColors = []
    let colorCheck = 0

    for (let i = 0; i < 8; i++) {
      favoriteColors[i] = {red: 256, green: 256, blue: 256}
      leastFavoriteColors[i] = {red: 256, green: 256, blue: 256}
    }

    for(let i = precision / 2 - 0.5; i < 256; i += precision) {
      // console.log('i = ', i)
      for(let j = precision / 2 - 0.5; j < 256; j += precision) {
        for(let k = precision / 2 - 0.5; k < 256; k += precision) {
          colorCheck = calcLikeability({red: i, green: j, blue: k})
          let spliceReason = ''
          function superlativeColorArray (fav) {
            let spliceIndex = 0
            do {
              if ( (fav ? favoriteColors[spliceIndex].red > 255 : leastFavoriteColors[spliceIndex].red > 255) || (fav ? (colorCheck > likeabilityOfFavoriteColors[spliceIndex]) : (colorCheck < likeabilityOfLeastFavoriteColors[spliceIndex]))) {
                favoriteColors[spliceIndex].red > 255 ? spliceReason = ' (Filling Empty) = ' :  '(Splicing Preferred) = '
                fav ? favoriteColors.splice(spliceIndex, 0, {red: i, green: j, blue: k}) : leastFavoriteColors.splice(spliceIndex, 0, {red: i, green: j, blue: k})
                fav ? likeabilityOfFavoriteColors[spliceIndex] = colorCheck : likeabilityOfLeastFavoriteColors[spliceIndex] = colorCheck
                console.log('Favorite color # ' + spliceIndex + spliceReason, {red: i, green: j, blue: k})
                spliceIndex = 8;
              }
              else {spliceIndex++}
              if (fav ? favoriteColors.length > 8 : leastFavoriteColors.length > 8) {fav ? favoriteColors.pop() : leastFavoriteColors.pop()}
            } while (spliceIndex < 8)
          }
          superlativeColorArray(true)
          superlativeColorArray(false)
        }
      }
    }

      //Improve each favorite color choice with a local binary search.
      function chooseFavoriteColorsBinary(color, level, fav, index) {
        // console.log('Color #: ' + index, color, 'Level: ', level, 'Fav: ', fav)
        let newColorCheck = 0, newColor = color
        let likeabilityOfNewColor = calcLikeability(newColor)

        for (let i = color.red - level/2 + level/(divNum * 2); i < color.red + level/2; i += level/divNum) {      
          // console.log('i = ', i)
          for(let j = color.green - level/2 + level/(divNum * 2); j < color.green + level/2; j += level/divNum) {
            for(let k = color.blue - level/2 + level/(divNum * 2); k < color.blue + level/2; k += level/divNum) {
              newColorCheck = calcLikeability({red: i, green: j, blue: k})
              if ((fav ? (newColorCheck > likeabilityOfNewColor) : (newColorCheck < likeabilityOfNewColor)) || (level == divNum && newColor.red % 1 != 0)) {
                  newColor = {red: i, green: j, blue: k}
                  // console.log('newColor: ', newColor)
              }
            }
          }
        }
        if (level > divNum) {newColor = chooseFavoriteColorsBinary(newColor, Math.max(level/divNum, divNum), fav, index)}
        else if (level > divNum) {newColor = chooseFavoriteColorsBinary(newColor, Math.max(level/divNum, divNum), fav, index)}
        return newColor
      }

    for (let i = 0; i < 8; i++) {
      favoriteColors[i] = chooseFavoriteColorsBinary(favoriteColors[i], precision, true, i)
      leastFavoriteColors[i] = chooseFavoriteColorsBinary(leastFavoriteColors[i], precision, false, i)
    }

    favoriteColors.sort((a, b) => (calcLikeability(b) > calcLikeability(a)))
    leastFavoriteColors.sort((a, b) => (calcLikeability(b) < calcLikeability(a)))
    
   
    const endTime = new Date().getTime()
    console.log('Execution time: ', endTime - startTime)

    
  }

  //Display the user's favorite and least favorite colors, then set styles of elements on the page using favorite colors.
  function displayFavoriteColors () {
    console.log("Favorite colors sorted: ", favoriteColors)
    favoriteColors.forEach ((color, index) => console.log('Favorite Color #', index, calcLikeability(color)))
    setFavoritesStyles(favoriteColors.map(color => ({backgroundColor: convertColorToHex(color)})))

    console.log("Least favorite colors sorted: ", leastFavoriteColors)
    leastFavoriteColors.forEach ((color, index) => console.log('Least Favorite Color #', index, calcLikeability(color)))
    setLeastFavoritesStyles(leastFavoriteColors.map(color => ({backgroundColor: convertColorToHex(color)})))

    const favoriteColorsSortedByBrightness = [...favoriteColors]
    favoriteColorsSortedByBrightness.sort((a, b) => (calcBrightness(b) > calcBrightness(a)))
    console.log('Favorite colors sorted by brightness: ', favoriteColorsSortedByBrightness)
    favoriteColorsSortedByBrightness.forEach((color, index) => console.log('Brightest Color #', index, calcBrightness(color)))
    
    if(colorChoices.length >= 16) {
      setFavoriteH3Styles({color: convertColorToHex(favoriteColors[0])})
      setFavoriteH5Styles({color: convertColorToHex(favoriteColors[1])})
      setLeastFavoriteH3Styles({color: convertColorToHex(leastFavoriteColors[0])})

      const lightnessIndex = 0.32
      setNavStyles({backgroundColor: lightenColor(favoriteColorsSortedByBrightness[3], lightnessIndex)})
      setHeaderStyles({backgroundColor: lightenColor(favoriteColorsSortedByBrightness[0], lightnessIndex)})
      setColorSectionHeaderStyles({backgroundColor: lightenColor(favoriteColorsSortedByBrightness[1], lightnessIndex)})
      setButtonStyles({backgroundColor: lightenColor(favoriteColorsSortedByBrightness[2], lightnessIndex)})
      setH1Styles({color: convertColorToHex(favoriteColorsSortedByBrightness[7])})
      setH2Styles({color: convertColorToHex(favoriteColorsSortedByBrightness[6])})
      // setMainStyles({backgroundImage: 'linear-gradient(' + convertColorToHex(favoriteColorsSortedByBrightness[4]) + ', ' + convertColorToHex(favoriteColorsSortedByBrightness[5]) + ', ' + convertColorToHex(favoriteColorsSortedByBrightness[6]) + ', ' + convertColorToHex(favoriteColorsSortedByBrightness[7]) +')'})
      setMainStyles({backgroundColor: lightenColor(favoriteColorsSortedByBrightness[2], lightnessIndex)})
      setSusStyles({backgroundColor: lightenColor(favoriteColorsSortedByBrightness[4], lightnessIndex)})
      setColorSectionStyles({backgroundColor: lightenColor(favoriteColorsSortedByBrightness[5], lightnessIndex)})
    }
  }   

  //Display either the user's sus pro choices or sus con choices.
  function displaySusChoices (fav) {
    let colorCheck = 0
    for (let i = 0; i < 8; i++) {
      susProChoices[i] = {color: {red: 255, green: 255, blue: 255}, index: 0}
      susConChoices[i] = {color: {red: 255, green: 255, blue: 255}, index: 0}
    }

    for (let i = 0; fav ? i < proChoices.length : i < conChoices.length; i++) {
      fav ? colorCheck = calcLikeability(proChoices[i]) : colorCheck = calcLikeability(conChoices[i])
      let spliceReason = ''

      function superlativeColorArray (fav) {
        let spliceIndex = 0
        do {
          const defaultColor = fav ? 
            (susProChoices[spliceIndex].color.red == 255 && susProChoices[spliceIndex].color.green == 255 && susProChoices[spliceIndex].color.blue == 255) :
            (susConChoices[spliceIndex].color.red == 255 && susConChoices[spliceIndex].color.green == 255 && susConChoices[spliceIndex].color.blue == 255)
          if ( (defaultColor) || (fav ? (colorCheck < likeabilityOfProColors[spliceIndex]) : (colorCheck > likeabilityOfConColors[spliceIndex])) ) {
            defaultColor ? spliceReason = ' (Filling Empty) = ' :  '(Splicing Preferred) = '
            fav ? susProChoices.splice(spliceIndex, 0, {color: proChoices[i], index: i}) : susConChoices.splice(spliceIndex, 0, {color: conChoices[i], index: i})
            fav ? likeabilityOfProColors[spliceIndex] = colorCheck : likeabilityOfConColors[spliceIndex] = colorCheck
            // fav ? console.log('Sus Pro Color # ' + spliceIndex + spliceReason, proChoices[i], colorCheck) : console.log('Sus Pro Con # ' + spliceIndex + spliceReason, proChoices[i], colorCheck)
            spliceIndex = 8;
          }
          else {spliceIndex++}
          if (fav ? susProChoices.length > 8 : susConChoices.length > 8) {fav ? susProChoices.pop() : susConChoices.pop()}
        } while (spliceIndex < 8)
      }

      superlativeColorArray(fav)
      fav ? susProChoices.sort((a, b) => (calcLikeability(b) < calcLikeability(a))) : susConChoices.sort((a, b) => (calcLikeability(b) > calcLikeability(a)))
    }

    if (fav) {
      console.log("Most sus pro color choices sorted: ", susProChoices)
      susProChoices.forEach ((color, index) => console.log('Sus pro color choice #', index, calcLikeability(color.color)))
      setSusProChoiceStyles(susProChoices.map(color => ({backgroundColor: convertColorToHex(color.color)})))
    }

    else {
      console.log("Most sus con colors choices sorted: ", susConChoices)
      susConChoices.forEach ((color, index) => console.log('Sus con color choice #', index, calcLikeability(color.color)))
      setSusConChoiceStyles(susConChoices.map(color => ({backgroundColor: convertColorToHex(color.color)})))
    }
  }

  //Eliminate a chosen color from the user's pro color or con color list.
  function eliminateSusColor (fav, index) {
    console.log('susColor Index = ', index)
    const newSusChoices = (fav ? susProChoices : susConChoices)
    console.log('newSusChoices: ', newSusChoices)
    const newChoices = (fav ? proChoices : conChoices)
    console.log('newChoices: ', newChoices)
    colorNodes[newChoices[newSusChoices[index].index].red][newChoices[newSusChoices[index].index].green][newChoices[newSusChoices[index].index].blue] = false
    newChoices.splice(newSusChoices[index].index, 1)
    console.log('newChoices: ', newSusChoices)
    displaySusChoices(fav)
  }

  //Function to be called when the user clicks on their preferred color box.
  function handleChoice(choice) {
    
    const checkIfUsed = [false, false]

    //Reset the sus pro and con choices displayed.
    for (let i = 0; i < 8; i++) {
      susProChoices[i] = {color: {red: 255, green: 255, blue: 255}, index: 0}
      susConChoices[i] = {color: {red: 255, green: 255, blue: 255}, index: 0}
    }
    setSusProChoiceStyles(susProChoices.map(color => ({backgroundColor: convertColorToHex(color.color)})))
    setSusConChoiceStyles(susConChoices.map(color => ({backgroundColor: convertColorToHex(color.color)})))

    //Record the preferred and not preferred color choices in an array.
    colorChoices.push({
      pro: displayedColors[choice],
      con: displayedColors[1 - choice]
    })
    console.log("colorChoices length = ", colorChoices.length)
    proChoices.push(displayedColors[choice])
    conChoices.push(displayedColors[1 - choice])

    let checkLevel = 128 / (2 ** (Math.floor(Math.log(2 * colorChoices.length) / log8)))

    //Update the newRows array for the 3-D plot.
    // setNewRows((prevNewRows) => prevNewRows.push({
    //   x1:color[int].red, 
    //   y1:color[int].green, 
    //   z1:color[int].blue, 
    //   x2:color[1 - int].red, 
    //   y2:color[1 - int].green, 
    //   z2:color[1 - int].blue
    // }))
    // console.log('NewRows = ', newRows)

    //Update the running tally of Euclidean prediction success.
    function updatePredictions (choice) {
      
      predictionTypes.forEach((type, index) => {
        if (prediction[index] == choice) {
          predictionMessage[index] = 'My prediction was correct!'
          if (index == 1 && !muted) {playSound("https://www.soundjay.com/buttons/sounds/beep-06.mp3")}
          correctPredictions[index]++
          counter[index]++
        }
        else if (prediction[index] != choice && prediction[index] < 2) {
          predictionMessage[index] = 'My prediction was incorrect!'
          if (index == 1 && !muted) {playSound("https://www.soundjay.com/buttons/sounds/beep-03.mp3")}
          counter[index]++
        }
        else {
          predictionMessage[index] = 'I did not make a ' + type + ' prediction.'
          if (index == 1 && !muted) {playSound("https://www.soundjay.com/buttons/sounds/beep-07a.mp3")}
        }
        predictionSuccessRate[index] = Math.round(100 * correctPredictions[index]/counter[index])
        if (counter[index] > 0) {predictionSuccessMessage[index] = 'My prediction success rate is: ' + Math.round(100 * correctPredictions[index]/counter[index]) + '%'}
        // else {predictionSuccessMessage[index] = 'I have not yet attempted to make any predictions.'}
        console.log(type + ' prediction success rate:' + Math.round(100 * correctPredictions[index]/counter[index]) + '%')
      })
    }
    if (colorChoices.length >= 16) {updatePredictions(choice)}

    //Choose favorite and least favorite colors.
    // chooseFavoriteColors(64, 2)

    //Animate the color box that was predicted, then choose and display two new random colors.
    document.getElementById(['color1', 'color2', 'prediction-messages-container'][prediction[1]]).animate(prediction[1] == 2 ? predictionAnimation2 : predictionAnimation, predictionAnimationTiming).finished
      .then(res => {
        console.log(res)

        //Determine whether a nearby color has already been chosen.
        function checkIfUsedNearby(color, level) {
          console.log ('color: ', color)
          console.log('colorChoices length = ', colorChoices.length,)
          console.log('level = ', level)

          for (let i = level * Math.floor(color.red / level); i < level * (Math.floor(color.red / level) + 1); i += 1) {          
            for(let j = level * Math.floor(color.green / level); j < level * (Math.floor(color.green / level) + 1); j += 1) {
              for(let k = level * Math.floor(color.blue / level); k < level * (Math.floor(color.blue / level) + 1); k += 1) {
                if (colorNodes[i][j][k]) {
                  return true
                }
              }
            }
          }
          return false
        }       

        // Choose two new random colors, assign the hex strings for each, and calculate the average distance pro and con for the new colors.
        do {
          for (let i = 0; i < 2; i++) {
            do {
              displayedColors[i] = assignRandomColor()
              checkIfUsed[i] = checkIfUsedNearby(displayedColors[i], checkLevel)
              if (checkIfUsed[i]) {console.log('Color already used, need to choose two new colors.')}
            }
            while (checkIfUsed[i])

            hex[i] = convertColorToHex(displayedColors[i])
            avgDistance[i] = {
              pro: avgDistanceFromChoices(displayedColors[i], 1, 440),
              con: avgDistanceFromChoices(displayedColors[i], 0, 440)      
            }
            avgLocalDistance[i] = {
              pro: avgDistanceFromChoices(displayedColors[i], 1, 150),
              con: avgDistanceFromChoices(displayedColors[i], 0, 150)      
            }
            likeabilityScore[i] = calcLikeability(displayedColors[i])
          }
          //Calculate the Euclidean distance between the two colors.
          euclideanDistance = distanceBetweenColors(displayedColors[0], displayedColors[1])
          if (euclideanDistance < 100) {console.log('Euclidean distance is too small, need to choose two new colors.')}
        }
        while (euclideanDistance < 100)

        //Set the 'used' property of the chosen color nodes to "true".
        colorNodes[displayedColors[0].red][displayedColors[0].green][displayedColors[0].blue] = true
        colorNodes[displayedColors[1].red][displayedColors[1].green][displayedColors[1].blue] = true

        //If at least 16 choices have been made, predict which of the two colors the user will prefer.
        if (colorChoices.length >= 16) {
          //Color prediction function.
          function determinePrediction(criteria0, criteria1, index) {
            if (criteria1 > criteria0) {return 1}
            else if (criteria1 < criteria0) {return 0}
            else {return 2}
          }
          //Predict which color the user will prefer based on each of the three criteria.
          prediction[0] = determinePrediction(avgDistance[0].con - avgDistance[0].pro, avgDistance[1].con - avgDistance[1].pro, 0)
          prediction[1] = determinePrediction(likeabilityScore[0], likeabilityScore[1], 0)
          prediction[2] = determinePrediction(avgLocalDistance[0].con - avgLocalDistance[0].pro, avgLocalDistance[1].con - avgLocalDistance[1].pro, 0)
        }

        // Set the new colors of the boxes on the screen
        setStyles([{backgroundColor: hex[0]}, {backgroundColor: hex[1]}])
      })
  }

  //Unpack arrays of objects into a separate array of values associated with an object key.
  function unpack(rowArray, key) {
    console.log('Rows = ', rowArray)
    console.log('Row map = ', rowArray.map(row => row.x1))
    return rowArray.map(row => row.x1)
  }

  //Draw a 3-D plot of all the preferred and not preferred color choices.
  function drawPlot(rows) {
    var trace1 = {
      x:unpack(rows, 'x1'), y: unpack(rows, 'y1'), z: unpack(rows, 'z1'),
      mode: 'markers',
      marker: {
        size: 12,
        line: {
        color: 'rgba(217, 217, 217, 0.14)',
        width: 0.5},
        opacity: 0.8},
      type: 'scatter3d'
    };

    var trace2 = {
      x:unpack(rows, 'x2'), y: unpack(rows, 'y2'), z: unpack(rows, 'z2'),
      mode: 'markers',
      marker: {
        color: 'rgb(127, 127, 127)',
        size: 12,
        symbol: 'circle',
        line: {
        color: 'rgb(204, 204, 204)',
        width: 1},
        opacity: 0.8},
      type: 'scatter3d'};

    var data = [trace1, trace2];
    var layout = {margin: {
      l: 0,
      r: 0,
      b: 0,
      t: 0
      }};
    Plotly.newPlot('tester', data, layout);
  };

  

  return (
    <main style = {mainStyles}>
      <NavBar 
        navStyles = {navStyles}
        handleAudioClick = {handleAudioClick}
        audioUrl = {muted ? 
          "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/High-contrast-audio-volume-muted.svg/640px-High-contrast-audio-volume-muted.svg.png" : 
          "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Speaker_Icon.svg/1200px-Speaker_Icon.svg.png"}
      />
      <Header 
        headerStyles = {headerStyles}
        h1Styles = {h1Styles}
      />
      <div id = 'main-content-container' >
        <div className = 'sus-colors-container' style = {susStyles}>
          <SusColorsButton 
            buttonStyles = {buttonStyles}
            displaySusChoices = {displaySusChoices}
            fav = {true}
          />
          <SusColorBoxes
            susStyles = {susProChoiceStyles}
            eliminateSusColor = {eliminateSusColor}
            fav = {true}
          />
        </div>
        <div id = 'color-section-container' style = {colorSectionStyles}>
          <ColorSectionHeader 
            colorSectionHeaderStyles = {colorSectionHeaderStyles}
            h2Styles = {h2Styles}
            euclideanDistance =  {euclideanDistance}
          />
          <div id = "color-boxes">
            <ColorBoxes 
              idArray1 = {['box1', 'box2']}
              idArray2 = {['color1', 'color2']}
              likeabilityScore = {likeabilityScore}
              avgDistance = {avgDistance}
              avgLocalDistance = {avgLocalDistance}
              handleChoice = {handleChoice}
              styles = {styles}
            />
          </div>
          <PredictionMessages 
              predictionMessage = {predictionMessage}
              predictionSuccessRate = {predictionSuccessRate}
              predictionSuccessMessage = {predictionSuccessMessage}
          />
          <FavoriteColorButtons 
            precisionLevels = {[64, 16]}
            chooseFavoriteColors = {chooseFavoriteColors}
            displayFavoriteColors = {displayFavoriteColors}
            divNum = {2}
            buttonStyles = {buttonStyles}
          />
          <div id = 'graph-container'>
            <button style = {buttonStyles} onClick = {() => drawPlot(newRows)}>DON'T! Click Here for Graph</button>
          </div>
        </div>
        <div className = 'sus-colors-container' style = {susStyles}>
          <SusColorsButton 
            buttonStyles = {buttonStyles}
            displaySusChoices = {displaySusChoices}
            fav = {false}
          />
          <SusColorBoxes
            susStyles = {susConChoiceStyles}
            eliminateSusColor = {eliminateSusColor}
            fav = {false}
          />
        </div>  
      </div>
      
      <div id = "favorite-colors-container">
        <h3 style = {favoriteH3Styles}>Your Favorite Colors</h3>
        <h5 style = {favoriteH5Styles}>You may click on any color box below to open a new tab with information about the given color.</h5>
        <FavoriteColorBoxes
          favoritesStyles = {favoritesStyles}
        />
        <h3 style = {leastFavoriteH3Styles}>Your Least Favorite Colors</h3> 
        <FavoriteColorBoxes
          favoritesStyles = {leastFavoritesStyles}
        />
      </div>

      

    </main>
  )
}

export default App