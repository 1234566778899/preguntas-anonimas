import React from 'react'
import { useForm } from 'react-hook-form'

export const SendQuestionApp = ({ sendQuestion }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    return (
        <div className="card-home col-md-4 py-3 mt-3">
            <form onSubmit={handleSubmit(sendQuestion)}>
                <div className='h-q'>
                    <p>Realiza una pregunta anónima</p>
                </div>
                <div className='b-q'>
                    <textarea {...register('question', { required: true })} className='inp-pregunta' placeholder='Envia una pregunta anónima...'></textarea>
                    {errors.question && <p className='mt-1 text-danger'>Debe completar este campo</p>}
                </div>
                <button className='btn-continuar'>Continuar</button>
            </form>
        </div>
    )
}
