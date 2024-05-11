import { useState } from 'react'



const Product = ({ imgUrl, score, id, handleScoreChange }) => {

    const [newScore, setNewScore] = useState(0);
    const [isInputValid, setIsInputValid] = useState(false)

    // Function to update the new score
    const handleScoreInputChange = (e) => {
        const inputScore = parseInt(e.target.value);
        setIsInputValid(true);
        setNewScore(isNaN(inputScore) ? '' : inputScore);
    };

    return (
        <div key={id} className='ml-20 rounded-full p-4  shadow-m'>
            <img className='w-60 h-60  rounded-md shadow' src={imgUrl} alt={`Image ${id}`} />
            <div>
                <p className='mt-2 text-xl text-gray-800'>Score: {score}</p>
                <input
                    type="number"
                    onChange={handleScoreInputChange}
                    className='border border-gray-300 px-2 py-1 mt-2 rounded-md focus:outline-none focus:ring focus:border-blue-500'
                />

                <button
                    onClick={() => handleScoreChange(newScore, id)}
                    disabled={!isInputValid}
                    className={`mt-2 px-4 py-2 rounded-md ${isInputValid ? 'bg-blue-500 hover:bg-blue-700 text-white' : 'bg-gray-300 cursor-not-allowed text-gray-500'}`}

                >
                    Update Score
                </button>
            </div>
        </div>
    )
}


export default Product;