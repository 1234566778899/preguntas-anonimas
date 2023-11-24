import React, { useEffect, useRef } from 'react'
import './styles/Home.css'
import { NavbarApp } from './NavbarApp'
import { io } from 'socket.io-client'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { CONFI } from '../config';
import { useForm } from 'react-hook-form';
import { showInfoToast } from '../utils';

const socket = io(CONFI.uri);

export const HomeApp = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const crearSala = () => {
        let codigo = '';
        for (let i = 0; i < 4; i++) {
            codigo += ('' + Math.floor(Math.random() * 10));
        }
        navigate(`/username/${codigo}`);
    }
    const unirse = (data) => {
        navigate(`/username/${data.code}`);
    }
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
                                <form onSubmit={handleSubmit(unirse)}>
                                    <input {...register('code', {
                                        required: true, validate: {
                                            length: value => value.length === 4 || 'Código no válido'
                                        }
                                    })} className='inp-primary' type="text" placeholder='Ingrese el código de la sala...' />
                                    {errors.code && <p className='text-danger mt-1'>Debe ingresar el código</p>}
                                    <button className='unirse mt-2'><i className="me-2 fa-solid fa-right-to-bracket"></i>UNIRSE </button>
                                </form>
                                <button className='crear' onClick={() => crearSala()}>CREAR <i className="ms-2 fa-solid fa-circle-plus"></i></button>
                            </div>
                        </div>
                        <div className="col-md-4"></div>
                    </div>
                </div>
            </div>
        </>
    )
}
