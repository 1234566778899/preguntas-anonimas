import React from 'react'

export const NavbarApp = ({ title }) => {
    return (
        <div className='nav-bar pb-1'>
            <nav className='container '>
                <br />
                <h3 className='text-center fw-bold'style={{textAlign:'center'}}>{title}</h3>
            </nav>
        </div>
    )
}
