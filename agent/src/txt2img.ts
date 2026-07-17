import axios from 'axios'
import fs from 'fs'

export const generateImageFromText = async (prompt: string, articleId: string) => {
    const apiEndpoint = 'http://localhost:7860/sdapi/v1/txt2img'

    try {
        const response = await axios.post(apiEndpoint, { prompt })
        const base64Image = response.data.images[0]
        if (typeof base64Image != 'string') throw new Error("Encoded Image was not a string")
        fs.writeFile('gogasImage.png', base64Image, { encoding: 'base64' }, (err) => {
            if (err) throw err
            console.log("Image saved")
        })

    } catch (error) {
        console.error("Image generation failed for article:", articleId, "with error:", error)
    }
}

generateImageFromText('cute puppy', 'buttu123ID')