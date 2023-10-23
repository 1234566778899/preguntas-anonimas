import React from 'react'

export const NavbarApp = ({ title }) => {
    return (
        <div >
            <nav className='container'>
                <br />
                <h3 className='text-white text-center fw-bold'style={{textAlign:'center'}}>{title}</h3>
            </nav>
        </div>
    )
}
