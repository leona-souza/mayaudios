import React, { useEffect, useState } from 'react';
import { app } from './base';
import './App.css';
import { NovoArquivo } from './NovoArquivo';
//import ReactAudioPlayer from 'react-audio-player';

const db = app.firestore();

function App() {
  const qtdCarregar = 3;
  const [arquivos, setArquivos] = useState([]);
  const [ordem, setOrdem] = useState('asc');
  const [exibidos, setExibidos] = useState(qtdCarregar);
  

  const changeOrder = () => {
    let novaOrdem = ordem === 'asc' ? 'desc' : 'asc';
    setOrdem(novaOrdem);
  }

  const handleScroll = () => {
    setExibidos(exibidos => exibidos + qtdCarregar);
  }

  useEffect(() => {
    db.collection('arquivos')
      .orderBy('timestamp', ordem)
      .limit(exibidos)
      .onSnapshot(snapshot => {
        const tempArquivos = [];
        snapshot.forEach(snap => {
          tempArquivos.push(snap.data());
        });
        setArquivos(tempArquivos);
    })
  }, [ordem, exibidos])

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
      <button onClick={handleScroll}>Carregar mais</button>
      </section>
      <div className='footer'>
        <NovoArquivo />
      </div>
      {console.log(exibidos)}
    </div>
  );
}

export default App;
