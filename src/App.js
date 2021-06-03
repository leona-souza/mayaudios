import React, { useEffect, useState } from 'react';
import { app } from './base';
import './App.css';
import { NovoArquivo } from './NovoArquivo';
//import ReactAudioPlayer from 'react-audio-player';

const db = app.firestore();

function App() {
  const [arquivos, setArquivos] = useState([]);
  const [ordem, setOrdem] = useState('asc');

  const changeOrder = () => {
    let novaOrdem = ordem === 'asc' ? 'desc' : 'asc';
    setOrdem(novaOrdem);
  }

  useEffect(() => {
    db.collection('arquivos').orderBy('timestamp', ordem).onSnapshot(snapshot => {
      const tempArquivos = [];
      snapshot.forEach(snap => {
        tempArquivos.push(snap.data());
      })
      setArquivos(tempArquivos);
    })
  }, [ordem])

  return (
    <div>
      <section className='container'>
        <h1 className='titulo'>MayAudios</h1>
        <button onClick={changeOrder}>Inverter ordem</button>
        {
          arquivos.map(arquivo => (
            <aside key={arquivo.titulo}>
              <div className='tituloArquivo'>{arquivo.titulo}</div>
              {
                arquivo.audio[0].url && arquivo.audio[0].url.match(/jpg|jpeg|png|gif|tif|tiff/gi) ?
                  <div className='imagem'>
                    <img 
                      src={arquivo.audio[0].url}
                      onClick={() => window.location.href=arquivo.audio[0].url}>
                    </img>
                  </div>
                :
                  <audio controls className='player'>
                    <source src={arquivo.audio[0].url} />
                  </audio>                 
              }
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
