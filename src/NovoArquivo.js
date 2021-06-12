import React, { useState } from 'react';
import { app } from './base';
import firebase from "firebase";

const db = app.firestore();
const storage = app.storage();

export const NovoArquivo = () => {
  const [titulo, setTitulo] = useState('');
  const [file, setFile] = useState(null);

  const handleUpload = async () => {

    if (!titulo || !file) {
      window.alert('Preencha todos os campos');
      return;
    } else {
      window.alert('O arquivo está sendo enviado');
    }

    const storageRef = storage.ref();
    const fileRef = storageRef.child(file.name);
    await fileRef.put(file);
    await db.collection('arquivos').doc(titulo).set({ 
      titulo,
      audio: firebase.firestore.FieldValue.arrayUnion({ url: await fileRef.getDownloadURL() }),
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    
    setTitulo('');
    setFile(null);
    window.alert("Arquivo enviado");
  }

  return(
    <>
      Título:
      <input type='text' value={titulo}
        onChange={e => setTitulo(e.target.value)} className='inputTitulo' />
      <input type='file' key={file} onChange={e => setFile(e.target.files[0])} className='inputArquivo' />
      <button onClick={() => handleUpload()}>Upload</button>
    </>
  )
}