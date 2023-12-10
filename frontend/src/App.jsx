import React from 'react';
import { useState, useEffect } from 'react';
import axios from "axios"
import './App.css';
import { Box, Button, Stack, Typography, ImageList, ImageListItem } from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';

function App() {
	const [file, setFile] = useState()
  const [fileName, setFileName] = useState()
  const [imgData, setImgData] = useState()
  const upload = () => {
    const formData = new FormData()
    formData.append("file", file)
    axios.post("http://localhost:3001/upload", formData)
    .then(res => {
      console.log("Upload Success")
      setFile(null)
      setFileName("")
      getImage()
    })
    .catch(err => console.log(err))
  }

  const getImage = () => {
    axios.get("http://localhost:3001/images")
    .then(res => {
      setImgData(res.data)
    })
    .catch(err => console.log(err))
  }

  const imgUrl = "http://localhost:3001/img/"

  useEffect(() => {
    getImage()
  },[]);

  return (
    <div className="App">
      <Stack direction={"column"} sx={{ mt: 4, mb: 6 }}>
        <Box>
          <Button variant="contained" color="primary" component="label">
            <input accept="image/*" type="file" onChange={(e) => { setFile(e.target.files[0]); setFileName(e.target.files[0].name) }} style={{ display: 'none' }}/>
            画像を選択
          </Button>
          <Typography sx={{ mt: 2 }}>
            {fileName}
          </Typography>
        </Box>
        <Box sx={{ mt: 4 }}>
          <Button variant="outlined" type="button" onClick={upload} startIcon={<FileUploadIcon />} disabled={!file}>
            アップロード
          </Button>
          <Button variant="outlined" type="button" onClick={getImage}>
            test
          </Button>
        </Box>
      </Stack>
      <ImageList cols={3} rowHeight={200} sx={{ height: "700px" }}>
      {imgData && imgData.images.map((item) => (
        <ImageListItem key={item}>
          <img
            srcSet={`${imgUrl}${item}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
            src={`${imgUrl}${item}?w=164&h=164&fit=crop&auto=format`}
            loading="lazy"
          />
        </ImageListItem>
      ))}
      </ImageList>
      
    </div>
  );
}

export default App;
