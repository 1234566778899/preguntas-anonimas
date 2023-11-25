import React, { useEffect, useRef, useState } from 'react'
import './styles/Sala.css'
import { NavbarApp } from './NavbarApp'
import { useNavigate, useParams } from 'react-router-dom'
import imgEspera from '../assets/esperando.gif'
import { io } from 'socket.io-client'
import { CONFI } from '../config'
import { useForm } from 'react-hook-form'
import { SendQuestionApp } from './SendQuestionApp'
import { showInfoToast } from '../utils'

export const SalaApp = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { codigo } = useParams();
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [codigoValido, setCodigoValido] = useState(true);
  const [titleNav, setTitleNav] = useState(`${'PIN DEL JUEGO: ' + codigo}`)
  const [pantallas, setPantalla] = useState([true, false, false, false, false, false]);
  const [usuarios, setUsuarios] = useState([]);
  const [resultados, setResultados] = useState([]);
  const [preguntas, setPreguntas] = useState([]);
  const [respuestas, setrespuestas] = useState({})
  const [cantidadPreguntas, setcantidadPreguntas] = useState(0);
  const [cantidadRespuestas, setcantidadRespuestas] = useState(0);
  const [numEspera, setNumEspera] = useState(1);

  useEffect(() => {
    let newSocket = io(`${CONFI.uri}`);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setCodigoValido(true);
    });

    if (localStorage.getItem('name')) {
      newSocket.emit('enviar-nombre', { codigo, name: localStorage.getItem('name') });
      setPantalla([false, true, false, false, false, false]);
    } else {
      navigate(`/username/${codigo}`);
    }
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
      socket.on('esperar', () => {
        alert('Debes esperar que termine la partida');
        navigate('/home');
      })

      socket.on('responder-preguntas', (data) => {
        setPreguntas(data);
        setPantalla([false, false, false, false, true, false]);
      })

      socket.on('resultados', (data) => {
        setPantalla([false, false, false, false, false, true]);
        setResultados(desordenar(data));
      })

      socket.on('reiniciar', () => {
        setPantalla([false, true, false, false, false, false]);
      })
      socket.on('cantidad-preguntas', (data) => {
        setcantidadPreguntas(data);
      })
      socket.on('cantidad-respuestas', (data) => {
        setcantidadRespuestas(data);
      })
      socket.on('nombre-repetido', () => {
        showInfoToast('Usuario existente');
        navigate(`/username/${codigo}`);
      })
      socket.on('en-juego', () => {
        showInfoToast('Debe esperar a que la partida termine');
        navigate('/home');
      })
    }
    return () => {
      if (socket) {
        socket.off('lista-usuarios');
        socket.off('empezar');
        socket.off('responder-preguntas');
        socket.off('resultados');
        socket.off('reiniciar');
        socket.off('nombre-repetido');
        socket.off('cantidad-preguntas');
        socket.off('cantidad-respuestas');
        socket.off('en-juego');
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
  const enviarPregunta = (data) => {
    socket.emit('enviar-pregunta', data.question);
    setPantalla([false, false, false, true, false, false]);
    setNumEspera(1);
  }
  const enviarRespuestas = () => {
    for (let p of preguntas) {
      if (!respuestas[p.id] || respuestas[p.id] == "") return showInfoToast('Debes completar todos los campos');
    }
    setPantalla([false, false, false, true, false, false]);
    socket.emit('enviar-respuestas', respuestas);
    setNumEspera(2);
  }
  const cambiarNombre = () => {
    navigate(`/username/${codigo}`);
  }
  const iniciarNuevo = () => {
    socket.emit('reiniciar');
  }
  const desordenar = (arr) => {
    return arr.sort(() => Math.random() - 0.5);
  }
  const salirSala = () => {
    localStorage.setItem('name', '');
    navigate('/home');
  }
  return (
    <>
      <div className="box-sala">
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
        <div className="container">
          <div className="row">
            <div className="col-md-4"></div>

            {
              pantallas[1] ? (
                <div className="col-md-4 bg-white sala-espera">
                  <div className="text-end">
                    <br />
                    <div className="d-flex justify-content-between">
                      <button className='btn-empezar' onClick={() => salirSala()}>Salir</button>
                      <button className='btn-empezar' onClick={() => socket.emit('empezar')}>Empezar</button>
                    </div>
                  </div>
                  <br />
                  <h3 className='text-center text-white fw-bold'>Cualquiera puede empezar la partida</h3>
                  <br />
                  <div className='usuarios'>
                    {
                      usuarios.map(user => (
                        <div key={user.id} className="user">
                          <span>{user.name}</span>
                        </div>))
                    }
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <button className='btn-empezar' onClick={() => cambiarNombre()}>Cambiar nombre</button>
                    <div className='cantidad'>
                      <div>
                        <i className="fa-solid fa-user"></i>
                        <span>{usuarios ? usuarios.length : '0'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : ''
            }
            {
              pantallas[2] ? (
                <SendQuestionApp sendQuestion={enviarPregunta} />
              ) : ''
            }
            {
              pantallas[3] ? (
                <div className="col-md-4 text-center card-home text-white py-3 mt-3">
                  <br />
                  <h1 className='text-center'>Esperando a los demas...</h1>
                  <img src={imgEspera} alt="img-espera" className='img-fluid' />
                  <p>Faltan responder: {numEspera == 1 ? cantidadPreguntas : cantidadRespuestas}</p>
                </div>
              ) : ''
            }
            {
              pantallas[4] ? (
                <div className="card-home col-md-4">
                  <br />
                  {
                    preguntas.map(pregunta => (
                      <div className='pregunta' key={pregunta.id}>
                        <p className='text-white'>{pregunta.description}</p>
                        <textarea onChange={(e) => obtenerRespuesta(pregunta.id, e.target.value)} placeholder='Respuesta...'></textarea>
                      </div>
                    ))
                  }
                  <div className="text-center">
                    <button className='mt-2 px-5' onClick={() => enviarRespuestas()}>Enviar</button>
                  </div>
                  <br />
                </div>
              ) : ''
            }
            {
              pantallas[5] ? (
                <div className="col-md-4 my-2">
                  <br />
                  <h3 className="text-center text-white">RESULTADOS</h3>
                  <br />
                  {
                    resultados.map((resultado, i) => (
                      <div key={resultado.id} className='box-question mt-2'>
                        <div className='head-question'>
                          {i + 1})  {resultado.pregunta}
                        </div>
                        <div className='body-answers'>
                          {
                            resultado.respuestas.map((result, index) => (
                              <span key={index + result}>{result}</span>
                            ))
                          }
                        </div>
                      </div>
                    ))
                  }

                  <div className="text-center">
                    <button className='mt-2 btn-first' onClick={() => iniciarNuevo()}>Iniciar de nuevo</button>
                  </div>
                </div>
              ) : ''
            }
            <div className="col-md-4">

            </div>
          </div>
        </div>
      </div>
    </>
  )
}
