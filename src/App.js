import React, { useEffect, useState } from 'react';
import { app } from './base';
import './App.css';
import { NovoArquivo } from './NovoArquivo';
import { sha256 } from 'js-sha256';

const db = app.firestore();

function App() {
  const qtdCarregar = 3;
  const [arquivos, setArquivos] = useState([]);
  const [ordem, setOrdem] = useState('asc');
  const [exibidos, setExibidos] = useState(qtdCarregar);
  const [permissao, setPermissao] = useState(false);
  const hash = "beebd46a46734efbdb822405628bfe7c3e517057d3760edb308b9cf4bd968ab3";
  
  const changeOrder = () => {
    setOrdem(ordem => ( 
      ordem === 'asc' ? 'desc' : 'asc'
      ));
    }
    
    const handleScroll = () => {
      setExibidos(exibidos => exibidos + qtdCarregar);
    }
    
    useEffect(() => {
      if (!permissao) {
        const valor = window.prompt('Digite a senha');
        if (valor === null) window.location.href = 'http://www.google.com.br';
        if (sha256(valor) === hash) {
          setPermissao(true);
        } else {
          window.location.href = "/";
        }
      }

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
            permissao && arquivos.map(arquivo => (
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
      </div>
    );
}

export default App;
