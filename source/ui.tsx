import React, {useState, useEffect} from 'react';
import {Box, Text, Transform, useInput,useApp} from 'ink';
import  randomWords  from 'random-words'
import { ForegroundColor } from 'chalk';
import { LiteralUnion } from 'type-fest';
const keyboard = [
	['Q','W','E','R','T','Y','U','I','O','P'],
	['A','S','D','F','G','H','J','K','L'],
	['Z','X','C','V','B','N','M']
] as const
const App = () =>
{
	const [incorrectLetters,setIncorrectLetters] = useState([])
	const [game,setGame] = useState({
		won:false,
		completed:false
	})
	const getRWord = ()=>{
		return randomWords({
			exactly:1,
			maxLength:5,

	   })[0].toUpperCase()	}
	const [word] = useState(()=>{
		let rword = getRWord()
	   while(rword.length!==5){
		rword = getRWord()
	   }
	   return rword
	})

	const { exit } = useApp()
	const [wordMatrix,setWordMatrix] =  useState(()=>{
		let arr : Array<Array<{
			bgColor:LiteralUnion<typeof ForegroundColor, string>,
			letter:string
		}>> = []
		for (let index = 0; index < 6; index++) {
			let arr_temp : Array<{
				bgColor:LiteralUnion<typeof ForegroundColor, string>,
				letter:string
			}>  = []
			for (let j = 0; j < 5; j++) {

				arr_temp.push({bgColor:null,letter:''})

			}
			arr.push(arr_temp)

		}
		return arr

	})
useInput((input,key)=>{

	input = input.toUpperCase()
	if(key.return){
		let {c,r} = currentRowCol
		let wMatrix = [...wordMatrix]
		let wordArr = word.split('')
		let arr = wMatrix[r]
		let potentialArr = []
		arr.forEach((l,i)=>{
			let letter = l.letter
			let letterRandom = wordArr[i]
			if(letter === letterRandom){
				l.bgColor = 'green'
				arr[i] = l
				potentialArr.forEach((el)=>{
					if(el.index !== i && el.descriptor.letter === l.letter){
						arr[el.index] = {...el.descriptor,bgColor:'gray'}
						setIncorrectLetters((prev)=>[...prev,el.descriptor.letter])
					}
				})
			}else if (wordArr.find((rnd)=>rnd === letter)){
				l.bgColor = "yellow"

				arr[i] = l
				potentialArr.push({descriptor:l,index:i})
			}else{
				setIncorrectLetters((prev)=>[...prev,letter])
				l.bgColor = "gray"
				arr[i] = l
			}
		})

		wMatrix[r] = [...arr]
		setWordMatrix([...wMatrix])
		let correctAnswers = arr.filter((ar)=>ar.bgColor==="green").length
		if(correctAnswers === 5){
			setGame((prev)=>{
				return { ...prev, completed:true,won:true}
			})
			exit()

		}

		r+=1
		c=0

		if(r>5){
			let correctAnswers = wordMatrix[5].filter((ar)=>ar.bgColor==="green").length
			if(correctAnswers < 5){
				setGame((prev)=>{
					return { ...prev, completed:true,won:false}
				})
			}
			else if(correctAnswers === 5){
				setGame((prev)=>{
					return { ...prev, completed:true,won:true}
				})
			}
			exit()
		}
		setCurrentRowCol({c,r})

	}
	else if (key.backspace){
		let currArr = [...wordMatrix]

		let {c,r} = currentRowCol
		currArr[r][c] = {...currArr[r][c],letter:''}
		if(c !== 0)
		c-=1



			setWordMatrix(()=>[...currArr])
			setCurrentRowCol({c,r})
	}
	else if(input === keyboard.flat().find((el)=>el===input)){
		let currArr = [...wordMatrix]

		let {c,r} = currentRowCol

		currArr[r][c] = {...currArr[r][c],letter:input}
		if(c+1>4){
			c = 4
		} else {
			c+=1

		}
		setWordMatrix(()=>[...currArr])
		setCurrentRowCol({c,r})

	}



})
	const [currentRowCol,setCurrentRowCol] = useState({r:0,c:0})
	useEffect(()=>{

	},[wordMatrix])

return <Box flexDirection='column'>
			<Box flexDirection='row'  alignSelf='center' alignItems='center' justifyContent='center'>
				<Text  color='greenBright'>You have {6 - currentRowCol.r} tries left </Text>
				<Text color='red'> Press CTRL+C or esc to quit!</Text>
				<Text color="yellowBright"> Press Backspace to delete and ENTER to go to the next set  </Text>
			</Box>
		{wordMatrix.map((el,i)=>{
			const {r,c} = currentRowCol
			return <Box  key={i} flexDirection='row' alignItems='center' justifyContent='center'>
				{el.map((t,j)=><Box key={j} width={6} height={2}  borderColor={ r === i && c ==j  ? 'redBright' : 'cyan' }  borderStyle='single'><Text bold color='whiteBright' backgroundColor={wordMatrix[i][j].bgColor}  key={j}>{' '+wordMatrix[i][j].letter+' '}</Text></Box>)}
			</Box>

		})}



{keyboard.map((el,i)=>{
			return <Box  key={i} flexDirection='row' alignItems='center' justifyContent='center'>
				{el.map((t,j)=>{
					const color = incorrectLetters.find((ltr)=>t===ltr) ? 'gray' : 'white'
				return <Box  key={j} width={6}   alignItems='center'  height={2} >
					<Text   backgroundColor={color} color={color === "white" ? "blackBright" : "whiteBright" } bold >{'  '+t+'  '}</Text>
				</Box>})}

			</Box>

		})}
		<Box  flexDirection='row' alignItems='center' justifyContent='center'>
	{game.completed && <Text color="white" backgroundColor={game.won ? "green" : "redBright"}> {game.won ? `You win! the word is ${word} ` : `You lose! the word was ${word}`} </Text>}
	</Box>
	</Box>




}

module.exports = App;
export default App;
