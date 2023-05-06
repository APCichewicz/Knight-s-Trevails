import { MouseEventHandler, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  // use state to store the first and second click
  const [firstClick, setFirstClick] = useState<number | null>(null)
  const [secondClick, setSecondClick] = useState<number | null>(null)

  // function to handle the click
  const handleClick = (e:React.MouseEvent<HTMLDivElement>) => {
    const i = parseInt((e.target as HTMLDivElement).id)
    console.log(i)
    // if both are not null, reset the first and second click
    if (firstClick !== null && secondClick !== null) {
      setFirstClick(null)
      setSecondClick(null)
      // reset the color of the squares
      handleReset()
      return
    }
    // if first click is null, set first click to i
    if (firstClick === null) {
      setFirstClick(i)
      document.getElementById(i.toString())?.classList.add('border-red-500', 'border-4')

    } else {
      // if second click is null, set second click to i
      setSecondClick(i)
      document.getElementById(i.toString())?.classList.add('border-green-500', 'border-4')
    }
  }
  // function to handle the reset
  const handleReset = () => {
    // reset the first and second click
    setFirstClick(null)
    setSecondClick(null)
    // reset the color of the squares
    for (let i = 0; i < 64; i++) {
      document.getElementById(i.toString())?.classList.remove('border-red-500', 'border-4')
      document.getElementById(i.toString())?.classList.remove('border-green-500', 'border-4')
    }
  }
  const legalMoves = (row:number, col:number): number[][]   => {
    // array of legal moves
    const moves = []
    // check if the move is legal
    if (row - 2 >= 0 && col - 1 >= 0) {
      moves.push([row - 2, col - 1])
    }
    if (row - 2 >= 0 && col + 1 < 8) {
      moves.push([row - 2, col + 1])
    }
    if (row - 1 >= 0 && col - 2 >= 0) {
      moves.push([row - 1, col - 2])
    }
    if (row - 1 >= 0 && col + 2 < 8) {
      moves.push([row - 1, col + 2])
    }
    if (row + 1 < 8 && col - 2 >= 0) {
      moves.push([row + 1, col - 2])
    }
    if (row + 1 < 8 && col + 2 < 8) {
      moves.push([row + 1, col + 2])
    }
    if (row + 2 < 8 && col - 1 >= 0) {
      moves.push([row + 2, col - 1])
    }
    if (row + 2 < 8 && col + 1 < 8) {
      moves.push([row + 2, col + 1])
    }
    return moves
  }
  // function to find the shortest path for a knight to travel between the first and second click locations
  const findPath = (firstClick:number, secondClick:number) => {
    // convert the numbers into row/col coordinates
    const [row1, col1] = [Math.floor(firstClick / 8), firstClick % 8]
    const [row2, col2] = [Math.floor(secondClick / 8), secondClick % 8]

    // create a queue to store the path
    const queue = [[row1, col1]]
    // create a set to store the visited squares
    const visited = new Set()
    // create a map to store the path
    const path = new Map()
    // set the first square to visited
    visited.add(`${row1},${col1}`)
    // set the first square to null
    path.set(`${row1},${col1}`, null)
    // while the queue is not empty
    while (queue.length > 0) {
      // dequeue the first element
      const [row, col] = queue.shift()!
      // if the row and col are the same as the second click, return the path
      if (row === row2 && col === col2) {
        return getPath(path, row2, col2)
      }
      // get the legal moves for the current square
      const moves = legalMoves(row, col)
      // for each move
      for (const [r, c] of moves) {
        // if the move has not been visited
        if (!visited.has(`${r},${c}`)) {
          // add the move to the queue
          queue.push([r, c])
          // add the move to the visited set
          visited.add(`${r},${c}`)
          // add the move to the path
          path.set(`${r},${c}`, [row, col])
        }
      }
    }
    // if the queue is empty, return null
    return null
  }
  // function to get the path
  const getPath = (path:Map<string, number[] | null>, row:number, col:number): string => {
    // create an array to store the path
    const result:number[][] = []
    // while the row and col are not null
    while (path.get(`${row},${col}`) !== null) {
      // add the row and col to the result
      result.push([row, col])
      // set the row and col to the previous row and col
      const temp = path.get(`${row},${col}`)
      row = temp[0]
      col = temp[1]
    }
    // add the first row and col to the result
    result.push([row, col])
    // reverse the result
    return result.reverse().map(([row, col]) => `${row},${col}`).join(' -> ')
  }




  return (
    <>
      <div className="h-screen w-screen grid justify-center items-center auto-rows-min gap-8 py-16 bg-slate-800 text-slate-200">
        <h2 className='text-6xl font-bold text-center'>Knight's Trevails</h2>
        {/* divs for a chess board */}
        <div className="grid grid-cols-8 h-96 w-96 m-auto"> {
          [...Array(64)].map((_, i) => {
            const row = Math.floor(i / 8)
            const col = i % 8
            const color = (row + col) % 2 === 0 ? 'bg-black' : 'bg-white'
            return <div onClick={handleClick} id={i.toString()} key={i} className={`h-12 w-12 ${color}`} />
          }) 
        }
        </div>
        <div className='grid grid-cols-1 auto-rows-min justify-center place-items-center'>
          <div>
            {/* reset button */}
            <button onClick={handleReset} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>Reset</button>
          </div>
          <div className=''>
            <div className='grid grid-cols-2'>
              {/* display the start location */}
              {firstClick !== null && <p className='text-2xl font-bold text-center'>Start: {Math.floor(firstClick/8) + "," + firstClick%8}</p>}
              {/* display the end location */}
              {secondClick !== null && <p className='text-2xl font-bold text-center'>End: {Math.floor(secondClick/8) + "," + secondClick%8}</p>} 
            </div>
            {/* if both clicks are not null, display the path */}
            {firstClick !== null && secondClick !== null && <p className='text-2xl font-bold text-center'>Path: {findPath(firstClick, secondClick)}</p>}
            {/* display the length of the path in bold */}
            {firstClick !== null && secondClick !== null && <p className='text-2xl font-bold text-center'>Length: {(findPath(firstClick, secondClick)?.split(' -> ').length || 0) - 1}</p>}
          </div>
        </div>
      </div>
    </>
  )
}

export default App
