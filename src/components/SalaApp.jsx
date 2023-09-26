import React, { useEffect, useRef, useState } from 'react'
import './styles/Sala.css'
import { NavbarApp } from './NavbarApp'
import { useNavigate, useParams } from 'react-router-dom'
import imgEspera from '../assets/esperando.gif'
import { AccordionDetails, AccordionSummary, Accordion } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { io } from 'socket.io-client'

export const SalaApp = () => {
  const { codigo } = useParams();
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const textName = useRef();
  const textPregunta = useRef();
  const [codigoValido, setCodigoValido] = useState(false);
  const [titleNav, setTitleNav] = useState(`${'PIN DEL JUEGO: ' + codigo}`)
  const [pantallas, setPantalla] = useState([true, false, false, false, false, false]);
  const [usuarios, setUsuarios] = useState([]);
  const [resultados, setResultados] = useState([]);
  const [respuestas, setrespuestas] = useState({})


  useEffect(() => {
    let newSocket = io('https://app-preguntas-anonimas-8a8d30c670d7.herokuapp.com/' + codigo);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setCodigoValido(true);
    });

    return () => {
      newSocket.disconnect();
    }
  }, [codigo]);

  useEffect(() => {
    if (socket) {
      socket.on('lista-usuarios', data => {
        setUsuarios(data);
      })

      socket.on('empezar', () => {
        setPantalla([false, false, true, false, false, false]);
      })

      socket.on('responder-preguntas', (data) => {
        setUsuarios(data);
        setPantalla([false, false, false, false, true, false]);
      })

      socket.on('resultados', (data) => {
        setPantalla([false, false, false, false, false, true]);
        setUsuarios(data);
        let r = data.map(user => user.results);
        setResultados(r);
      })

      socket.on('reiniciar', () => {
        setPantalla([false, true, false, false, false, false]);
      })
    }
    return () => {
      if (socket) {
        socket.off('lista-usuarios');
        socket.off('empezar');
        socket.off('responder-preguntas');
        socket.off('resultados');
        socket.off('reiniciar');
      }
    }
  }, [socket])

  useEffect(() => {
    if (pantallas[0]) {
      setTitleNav('Ingrese un nombre de usuario');
    }
    else if (pantallas[1]) {
      setTitleNav('Pin del juego: ' + codigo);
    } else if (pantallas[2]) {
      setTitleNav('Haz una pregunta');
    } else if (pantallas[3]) {
      setTitleNav('Esperando..')
    } else if (pantallas[4]) {
      setTitleNav('Responde a las preguntas...')
    } else {
      setTitleNav('Respuestas anónimas');
    }
  }, [pantallas])
  const obtenerRespuesta = (key, value) => {
    setrespuestas(aux => ({ ...aux, [key]: value }));
  }
  const enviarNombre = () => {
    if (textName.current.value != "") {
      socket.emit('enviar-nombre', textName.current.value);
      setPantalla([false, true, false, false, false, false]);
    }
  }
  const enviarPregunta = () => {
    if (textPregunta.current.value != "") {
      socket.emit('enviar-pregunta', textPregunta.current.value);
      setPantalla([false, false, false, true, false, false]);
    }
  }
  const enviarRespuestas = () => {
    for (let key in respuestas) {
      if (respuestas[key] == "") return;
    }

    setPantalla([false, false, false, true, false, false]);
    socket.emit('enviar-respuestas', respuestas);
  }
  const iniciarNuevo = () => {
    socket.emit('reiniciar');
  }
  return (
    <>
      <NavbarApp title={titleNav} />
      {
        !codigoValido ? (
          <div className="modal">
            <div className="box">
              <h4>La sala con el código {codigo} no existe</h4>
              <div className="text-center">
                <img src="https://st2.depositphotos.com/6582994/11689/v/450/depositphotos_116891472-stock-illustration-emoticon-sad-face-sad-emoji.jpg" alt="img" />
              </div>
              <button onClick={() => navigate('/home')}>Aceptar</button>
            </div>
          </div>
        ) : ''
      }
      {
        pantallas[0] ? (
          <div className="container">
            <br />
            <div className="row">
              <div className="col-md-4"></div>
              <div className="col-md-4 p-1">
                <div className="card p-4">
                  <h1 className="text-center">EMPEZAR A JUEGAR</h1>
                  <br />
                  <input ref={textName} type="text" placeholder='Ingrese su nombre...' />
                  <button className='unirse mt-2' onClick={() => enviarNombre()}>CONTINUAR</button>
                </div>
              </div>
              <div className="col-md-4"></div>
            </div>
          </div>
        ) : ''
      }
      <div className="container">
        <div className="row">
          <div className="col-md-4"></div>

          {
            pantallas[1] ? (
              <div className="col-md-4 bg-white sala-espera">
                <div className="text-end">
                  <br />
                  <button className='btn-empezar' onClick={() => socket.emit('empezar')}>Empezar</button>
                </div>
                <br />
                <h3 className='text-center text-white fw-bold'>Esperando amigos...</h3>
                <br />
                <div className='usuarios'>
                  {
                    usuarios.map(user => (
                      <div key={user.id} className="user">
                        <span>{user.name}</span>
                      </div>))
                  }
                </div>
                <div className='cantidad'>
                  <div>
                    <i className="fa-solid fa-user"></i>
                    <span>{usuarios ? usuarios.length : '0'}</span>
                  </div>
                </div>
              </div>
            ) : ''
          }
          {
            pantallas[2] ? (
              <div className="col-md-4 sala-pregunta bg-white py-3 mt-3">
                <br />
                <p>Realiza una pregunta anónima</p>
                <textarea ref={textPregunta} className='inp-pregunta'></textarea>
                <div className='mt-3 text-center'>
                  <button className='btn-continuar' onClick={() => enviarPregunta()}>Continuar</button>
                </div>
              </div>
            ) : ''
          }
          {
            pantallas[3] ? (
              <div className="col-md-4 text-center bg-white py-3 mt-3">
                <br />
                <h1 className='text-center'>Esperando a los demas...</h1>
                <img src={imgEspera} alt="img-espera" className='img-fluid' />
              </div>
            ) : ''
          }
          {
            pantallas[4] ? (
              <div className="col-md-4">
                <br />
                {
                  usuarios.map(user => (
                    <div className='pregunta' key={user.id}>
                      <p>{user.pregunta ? user.pregunta : 'Cargando..'}</p>
                      <textarea onChange={(e) => obtenerRespuesta(user.id, e.target.value)} placeholder='Respuesta...'></textarea>
                    </div>
                  ))
                }
                <div className="text-center">
                  <button className='btn btn-success mt-2 px-5' onClick={() => enviarRespuestas()}>Enviar</button>
                </div>
                <br />
              </div>
            ) : ''
          }
          {
            pantallas[5] ? (
              <div className="col-md-4 my-2">
                <br />
                <h1 className="text-center">RESULTADOS</h1>
                {
                  usuarios.map(user => (
                    <Accordion className='acordeon' key={user.id}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        {user.pregunta}
                      </AccordionSummary>
                      <AccordionDetails>
                        <ul>
                          {
                            resultados.map((result, index) => (
                              <li key={user.id + result[user.id] + index}>{result[user.id] ? result[user.id] : ''}</li>
                            ))
                          }
                        </ul>
                      </AccordionDetails>
                    </Accordion>
                  ))
                }
                <div className="text-center">
                  <button className='btn btn-success mt-2' onClick={() => iniciarNuevo()}>Iniciar de nuevo</button>
                </div>
              </div>
            ) : ''
          }
          <div className="col-md-4">

          </div>
        </div>
      </div>
    </>
  )
}
