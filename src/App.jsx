import React from "react";
import './App.css'

const fs = require('fs');
const sharp = require('sharp');


function Converter() {
  const [dragActive, setDragActive] = React.useState(false);
  const [QntFiles, setQntFiles] = React.useState(0)
  const [uploadedFiles, setUploadedFiles] = React.useState([])

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
    }
  };

  const handleChange = function(e) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setQntFiles(QntFiles + 1)
    }
  };

  const onButtonClick = () => {
    inputRef.current.click();
  };

  const downloadFile = (filePath, fileName) => {
    const fileUrl = URL.createObjectURL(new Blob([filePath]));
    const downloadLink = document.createElement('a');
    downloadLink.href = fileUrl;
    downloadLink.setAttribute('download', fileName);
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  function convertJpgToPng(inputPath, outputPath, callback) {
    fs.readFile(inputPath, (err, data) => {
      if (err) throw err;

      sharp(data)
        .png()
        .toBuffer((err, pngData) => {
          if (err) throw err;

          fs.writeFile(outputPath, pngData, (err) => {
            if (err) throw err;
            callback(pngData);
          });
        });
    });
  }

  const convertFiles = (filesArray) => {
    filesArray.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const inputBuffer = Buffer.from(event.target.result);
        const outputFilePath = file.path.replace('.jpg', '.png');
        convertJpgToPng(inputBuffer, outputFilePath, (pngData) => {
          downloadFile(pngData, outputFilePath.split('/').pop());
        });
      };
      reader.readAsArrayBuffer(file);
    });
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
      <button className="convert-button" onClick={convertFiles(uploadedFiles)}>Convert files</button>
    </form>
  );
};

export default Converter;
