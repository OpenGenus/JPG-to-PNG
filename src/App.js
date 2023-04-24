import React, { useState } from "react";
import './App.css'
import * as Jimp from'jimp'

function DragDropFile() {
  const [dragActive, setDragActive] = React.useState(false);
  const [QntFiles, setQntFiles] = React.useState(0)
  const [uploadedFiles, setUploadedFiles] = useState([])

  const inputRef = React.useRef(null);
  
  const handleDrag = function(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  
  const handleDrop = function(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const filesArray = Array.from(e.dataTransfer.files);
      setUploadedFiles(prevUploadedFiles => [...prevUploadedFiles, ...filesArray])
      // handleFiles(e.dataTransfer.files);
    }
  };
  
  const handleChange = function(e) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setQntFiles(QntFiles + 1)
      const filesArray = Array.from(e.target.files);
      setUploadedFiles(prevUploadedFiles => [...prevUploadedFiles, ...filesArray])
      // handleFiles(e.target.files);
    }
  };
  
  const onButtonClick = () => {
    inputRef.current.click();
  };

  const convertFiles = () => {
  for(let i = 0; i < uploadedFiles.length; i++){
    Jimp.read(uploadedFiles[i], function (err, image){
      if(err){
        window.alert(err)
      }else{
        image.write(`${uploadedFiles[i].name.split('.')[0]}.png`, () => {
          const url = URL.createObjectURL(image);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${uploadedFiles[i].name.split('.')[0]}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        });
      }
    })
  }
}

  
  
  
  return (
    <form id="form-file-upload" onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
      <input ref={inputRef} type="file" id="input-file-upload" accept="image/jpeg, image/jpg" multiple={true} onChange={handleChange} />
      <label id="label-file-upload" htmlFor="input-file-upload" className={dragActive ? "drag-active" : "" }>
        <div>
          <p>Drag and drop your file here or</p>
          <button className="upload-button" onClick={onButtonClick}>Upload a file</button>
          <p>Quantity of files: {QntFiles}</p>
        </div> 
      </label>
      { dragActive && <div id="drag-file-element" onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}></div> }
      <button className="convert-button" onClick={convertFiles}>Convert files</button>
    </form>
  );
};
  
  export default DragDropFile;