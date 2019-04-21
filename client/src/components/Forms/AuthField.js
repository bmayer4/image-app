import React from 'react'

export const JoinField = ({ input, type, label, meta, err }) => (  
    <div className="form-group">
    <label htmlFor={label}>{label}</label>
    <input {...input} id={label} type={type} className={`form-control ${((meta.touched && meta.error) || (err && label === 'Email')) && 'is-invalid'}`} />
    { meta.touched && meta.error && <div className="invalid-feedback">{meta.error}</div> }
    { err && label === 'Email' && <div className="registerError">{err}</div> }
</div>
);

export const LoginField = ({ input, type, label, meta }) => (  
    <div className="form-group">
    <label htmlFor={label}>{label}</label>
    <input {...input} id={label} type={type} className={`form-control ${meta.touched && meta.error && 'is-invalid'}`} />
    { meta.touched && meta.error && <div className="invalid-feedback">{meta.error}</div> }
</div>
);
