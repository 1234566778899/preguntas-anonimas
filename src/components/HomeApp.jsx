import React, { useEffect, useRef } from 'react'
import './styles/Home.css'
import { NavbarApp } from './NavbarApp'
import { io } from 'socket.io-client'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const socket = io('https://preguntitas-d87cda84ac9f.herokuapp.com');

export const HomeApp = () => {
    const navigate = useNavigate();
    const textCodigo = useRef(null);
    const [mensajeAlerta, setMensajeAlerta] = useState('Ingrese un código valido');

    const [codigoValido, setCodigoValido] = useState(true);
    const crearSala = () => {
        let codigo = '';
        for (let i = 0; i < 4; i++) {
            codigo += ('' + Math.floor(Math.random() * 10));
        }
        socket.emit('crear-sala', codigo);
        navigate(`/sala/${codigo}`);
    }
    const unirse = () => {
        if (textCodigo.current.value.length != 4) {
            setMensajeAlerta('Ingrese un código valido');
            setCodigoValido(false);
        } else {
            socket.emit('unirse', textCodigo.current.value);
        }
    }
    useEffect(() => {
        const hanfleFocus = () => {
            setCodigoValido(true);
        }

        socket.on('validar', data => {
            if (data) {
                navigate(`/sala/${textCodigo.current.value}`);
            } else {
                setMensajeAlerta('No existe un sala con ese código');
                setCodigoValido(false);
            }
        })

        return () => {
            socket.off('validar');
        }
    }, [])

    return (
        <>
            <div className="box-home">
                <NavbarApp title={'PREGUNTAS ANÓNIMAS'} />
                <div className="container">
                    <br />
                    <div className="row">
                        <div className="col-md-4"></div>
                        <div className="col-md-4 p-1">
                            <div className="card-home p-4">
                                <h3 className="text-center">EMPEZAR A JUEGAR</h3>
                                <br />
                                <input className='inp-primary' ref={textCodigo} type="text" placeholder='Ingrese el código de la sala...' />
                                {!codigoValido ? (<div className="alert alert-danger">{mensajeAlerta}</div>) : ''}
                                <button className='unirse mt-2' onClick={() => unirse()}><i class="me-2 fa-solid fa-right-to-bracket"></i>UNIRSE </button>
                                <button className='crear' onClick={() => crearSala()}>CREAR <i class="ms-2 fa-solid fa-circle-plus"></i></button>
                            </div>
                        </div>
                        <div className="col-md-4"></div>
                    </div>
                </div>
            </div>
        </>
    )
}
