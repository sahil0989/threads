import { useState } from 'react'
import { toast } from 'sonner';

function usePreviewImg() {
  
    const [imgUrl, setImgUrl] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if(file && file.type.startsWith("image/")) {
            const reader = new FileReader();

            reader.onloadend = () => {
                setImgUrl(reader.result);
            }

            console.log(file)
            reader.readAsDataURL(file);
        } else {
            setImgUrl(null)
            return toast.error("Error in file uploading...", {duration: 2000})
        }
    }
  
    return {handleImageChange, imgUrl}
}

export default usePreviewImg