import React, { useEffect, useState } from 'react';
import { app } from './base';
import './App.css';
import { NovoArquivo } from './NovoArquivo';
import ReactAudioPlayer from 'react-audio-player';

const db = app.firestore();

function App() {
  const [arquivos, setArquivos] = useState([]);

  useEffect(() => {
    db.collection('arquivos').orderBy('timestamp').onSnapshot(snapshot => {
      const tempArquivos = [];
      snapshot.forEach(snap => {
        tempArquivos.push(snap.data());
      })
      setArquivos(tempArquivos);
    })
  }, [])

  return (
    <div>
      <section className='container'>
        <h1 className='titulo'>MayAudios</h1>
        {
          arquivos.map(arquivo => (
            <aside key={arquivo.titulo}>
              <div className='tituloArquivo'>{arquivo.titulo}</div>
              <ReactAudioPlayer 
                src={arquivo.audio[0].url}
                autoPlay='false'
                controls
                className='player'
              />
              <div className='data'>
                {arquivo.timestamp?.toDate().toDateString()} - {arquivo.timestamp?.toDate().toLocaleTimeString('en-US')}
              </div>
            </aside>
          ))
        }
      </section>
      <div className='footer'>
        <NovoArquivo />
      </div>
    </div>
  );
}

export default App;
