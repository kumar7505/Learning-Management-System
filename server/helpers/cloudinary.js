const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_NAME,
    api_secret : process.env.CLOUDINARY_API_SECRET,
});

const uploadMediaToCloudinary = async(filePath) => {
    try{
        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: 'auto'
        })
        return result;
    } catch(err){
        console.log(err);
        throw new Error('Error uploading to cloud');
    }
};

const deleteMediaFromCloudinary = async(publicId) => {
    try {
        const sanitizedId = publicId.split('.')[0];
        await cloudinary.uploader.destroy(sanitizedId);
    } catch(err) {
        console.error(`Failed to delete asset ${publicId}:`, err); 
        throw new Error("Failed to delete assets from cloud");
    }
};

module.exports = { uploadMediaToCloudinary, deleteMediaFromCloudinary };