import { useState, useEffect } from 'react'
import axios from 'axios';
import Product from './Product';

const API_BASE_URL = "http://localhost:5000/skincare";

const Skincare = ({ url }) => {

    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [keyword, setKeyword] = useState('');


    // Fetch random products when the component mounts
    useEffect(() => {
        fetchFromServer();
    }, [])

    // Function to fetch 5 random products from the server
    const fetchFromServer = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}`);
            setData(response.data);

        } catch (e) {
            setError('Failed to load data from server.');
            console.error(e);

        } finally {
            setLoading(false);
        }


    };


    // Helper function to generate a Google Drive direct link through a proxy
    const getImageUrl = (path) => {
        const googleDriveIdMatch = path.match(/\/d\/(.+?)\//); //Extracts Google Drive file ID from the path
        if (googleDriveIdMatch && googleDriveIdMatch[1]) {
            const googleDriveDirectLink = `https://drive.google.com/uc?export=download&id=${googleDriveIdMatch[1]}`;

            // Returns a proxied image URL
            return `http://localhost:5000/image-proxy?imageUrl=${encodeURIComponent(googleDriveDirectLink)}`;
        }
        return path;
    };


    // Function to update the score of a product
    const searchImages = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Send a PUT request to update the score of the specified product
            const response = await axios.get(`${API_BASE_URL}/search`, {
                params: { keyword }
            });
            setData(response.data);

        } catch {
            setError('Search request failed.');
            console.error(e);
        } finally {
            setLoading(false);
            setKeyword(''); // Clear the search input value after searching

        }

    };

    const handleScoreChange = async (newScore, productId) => {
        setLoading(true);
        try {
            const response = await axios.put(`${API_BASE_URL}/${productId}`, {
                newScore: newScore
            });
            console.log('Score updated successfully:', response.data);

            // Update the state with the new score immediately
            setData(prevData =>
                prevData.map((product) =>
                    product.id === productId ? { ...product, score: newScore } : product
                )
            );

        } catch (error) {
            console.error('Error updating score:', error);
        }
        finally {
            setLoading(false);
        }
    };



    return (
        <div className='flex flex-col items-center justify-center h-screen bg-gradient-to-b from-blue-50 to-purple-100'>
            <h1 className='text-black font-bold text-4xl mb-20'>Skincare Product Search</h1>

            <form onSubmit={searchImages}
                className='mb-8 space-x-4'

            >
                <input
                    type="text"
                    placeholder="Search by keyword..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className='border border-gray-300 px-4 py-2 mr-2 rounded focus:outline-none focus:ring focus:border-blue-500'

                />
                <button type="submit"
                    className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring focus:border-blue-500 '
                >Search
                </button>


            </form>
            <div className='flex items-center'>
                {loading ? (
                    <p className="text-blue-600">Loading...</p>
                ) : data.length > 0 ? (
                    (data.map((img, idx) =>

                        <Product
                            imgUrl={getImageUrl(img.path)}
                            score={img.score} id={img.id}
                            handleScoreChange={handleScoreChange}
                        />
                    ))) :
                    <p className='text-red-500'>No images found</p>
                }

            </div>
            <div className='mt-40'>
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
                    onClick={fetchFromServer}
                >
                    Change Products
                </button>
            </div>
        </div>
    );
}

export default Skincare