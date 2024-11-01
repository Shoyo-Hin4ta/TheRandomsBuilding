import React from 'react';
import Hero from '../components/Hero/Hero';
import AuthForm from '../components/Auth/AuthForm';
import axios from 'axios';

const HomePage = () => {
const [selectedImage, setSelectedImage] = useState(null);
const [result, setResult] = useState('');
    // Handle file input
    const handleImageChange = (e) => {
        setSelectedImage(e.target.files[0]);
    };
    // Handle image upload and recognition
    const handleImageUpload = async () => {
        if (!selectedImage) {
            alert('Please select an image first!');
            return;
        }

        const formData = new FormData();
        formData.append('image', selectedImage);

        try {
            // Send the image to the backend for recognition
            const response = await axios.post('/api/recognize-food', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setResult(response.data.result); // Display
        } catch (error) {
            console.error('Error recognizing food:', error);
            alert('Failed to recognize the food.');
        }
    };


  return (

    <div className="flex min-h-screen bg-green-50">
      <div className="w-1/2 bg-green-600 flex items-center justify-center text-white p-12">
        <Hero />
      </div>
        <h1>Diet Analyzer</h1>
            {/* Image file */}
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {/* recognition */}
            <button onClick={handleImageUpload}>Recognize Food Picture</button>
            {/* Display results */}
            {result && <p>Recognized Food: {result}</p>}
      <div className="w-1/2 flex items-center justify-center p-12">
        <AuthForm />
      </div>
    </div>
  );
};

export default HomePage;