import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { CONFI } from '../config';
import { io } from 'socket.io-client';

export const UserNameApp = () => {
  const { codigo } = useParams();
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    let newSocket = io(`${CONFI.uri}`);
    setSocket(newSocket);
    // if (localStorage.getItem('name')) {
    //   navigate(`/sala/${codigo}`);
    // }
    return () => {
      newSocket.disconnect();
    }
  }, [codigo]);

  const enviarNombre = (data) => {
    localStorage.setItem('name', data.name);
    navigate(`/sala/${codigo}`);
  }

  return (
    <div className="box-sala">
      <div className="container">
        <br />
        <div className="row">
          <div className="col-md-4"></div>
          <div className="col-md-4 p-1">
            <div className="card-home p-4">
              <h3 className="text-center">EMPEZAR A JUEGAR</h3>
              <br />
              <form onSubmit={handleSubmit(enviarNombre)}>
                <input className='inp-primary' {...register('name', { required: true })} type="text" placeholder='Ingrese su nombre...' />
                {
                  errors.name && <p className='alert alert-danger mt-1'>Campo obligatorio</p>
                }
                <button className='unirse mt-3'>CONTINUAR</button>
              </form>
              <button className='unirse mt-2' onClick={() => navigate('/home')}>SALIR</button>
            </div>
          </div>
          <div className="col-md-4"></div>
        </div>
      </div>
    </div>
  )
}
