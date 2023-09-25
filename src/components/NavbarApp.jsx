import React from 'react'

export const NavbarApp = ({title}) => {
    return (
        <div style={{backgroundColor:'#D8EAFF',padding:'10px',color:'#1368CE'}}>
            <nav className='container d-flex justify-content-between'>
                <h3 className='fw-bold'>{title}</h3>
            </nav>
        </div>
    )
}
