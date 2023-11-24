import React from 'react'
import { useForm } from 'react-hook-form'

export const SendQuestionApp = ({ sendQuestion }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    return (
        <div className="card-home card-preguntar col-md-4 sala-pregunta py-3 mt-3">
            <br />
            <p>Realiza una pregunta anónima</p>
            <form onSubmit={handleSubmit(sendQuestion)}>
                <textarea {...register('question', { required: true })} className='inp-pregunta'></textarea>
                {errors.question && <p className='mt-1 text-danger'>Debe completar este campo</p>}
                <div className='mt-3 text-center'>
                    <button className='btn-continuar' type='submit'>Continuar</button>
                </div>
            </form>
        </div>
    )
}
