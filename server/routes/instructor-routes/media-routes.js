const express = require('express');
const multer = require('multer');
const { uploadMediaToCloudinary, deleteMediaFromCloudinary } = require('../../helpers/cloudinary');

const router = express.Router();

const upload = multer({dest: 'upload/'});

router.post('/upload', upload.single('file'), async(req, res) => {
    
    try {
        const result = await uploadMediaToCloudinary(req.file.path);
        res.status(200).json({
            success: true,
            data: result,
        });
    } catch(err) {
        console.log(err);
        res.status(500).json({
            success: false, 
            message: 'Error uploading file',
        });
    }
});

router.delete('/delete/:id', async(req, res) => {
    
    try {

        const {id} = req.params;

        if(!id){
            
            return res.status(400).json({
                success: false,
                message: 'Asset Id is required',
            });
        }
        

        await deleteMediaFromCloudinary(id);

        res.status(200).json({
            success: true,
            message: "Asset dleted successfully form cloud",
        });

    } catch(err) {
        
        console.log(err);
        res.status(500).json({
            success: false, 
            message: 'Error deleting file',
        });
    }
});

router.post('/bulk-upload', upload.array('files', 10), async(req, res) => {
    try {
        const uploadPromises = req.files.map(fileItem => uploadMediaToCloudinary(fileItem.path));

        const results = await Promise.all(uploadPromises);

        res.status(200).json({
            success: true, 
            data: results,
        })
    } catch(e) {
        console.log(err);
        res.status(500).json({
            success: false, 
            message: 'Error in bulk upload',
        });
    }
})
module.exports = router;