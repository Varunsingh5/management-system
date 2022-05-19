import React, { useState, useEffect } from "react";
import ContactForm from "./ContactForm"
import { firebaseDb } from "../../firebase";
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

const Contacts = () => {

    var [contactObjects, setContactObjects] = useState({})
    var [currentId, setCurrentId] = useState('')

    useEffect(() => {
        // firebaseDb.child('contacts').on('value', snapshot => {
        //     if (snapshot.val() != null)
        //         setContactObjects({
        //             ...snapshot.val()
        //         })
        //     else
        //         setContactObjects({})

        // })
    }, [])// similar to componentDidMount

    const addOrEdit = obj => {
        if (currentId === '')
            firebaseDb.child('contacts').push(
                obj,
                err => {
                    if (err)
                        console.log(err)
                    else
                        setCurrentId('')
                }
            )
        else
            firebaseDb.child(`contacts/${currentId}`).set(
                obj,
                err => {
                    if (err)
                        console.log(err)
                    else
                        setCurrentId('')
                }
            )
    }

    const onDelete = key => {
        if (window.confirm('Are you sure to delete this record?')) {
            debugger
            firebaseDb.child(`contacts/${key}`).remove(
                err => {
                    if (err)
                        console.log(err)
                    else
                        setCurrentId('')
                }
            )
        }
    }

    return (
        <>
            <div className="jumbotron jumbotron-fluid">
                <div className="container">
                    <h1 className="display-4 text-center">Contact Register</h1>
                </div>
            </div>

            <Grid item xs={6}>

                <ContactForm {...({ addOrEdit, currentId, contactObjects })} />

            </Grid>
            <Grid xs={6}>
                <table className="table table-borderless table-stripped">
                    <thead className="thead-light">
                        <tr>
                            <th>Full Name</th>
                            <th>Mobile</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            Object.keys(contactObjects).map(id => {
                                return <tr key={id}>
                                    <td>{contactObjects[id].fullName}</td>
                                    <td>{contactObjects[id].mobile}</td>
                                    <td>{contactObjects[id].email}</td>
                                    <td>
                                        <a className="btn text-primary" onClick={() => { setCurrentId(id) }}>
                                            <i className="fas fa-pencil-alt"></i>
                                        </a>
                                        <a className="btn text-danger" onClick={() => { onDelete(id) }}>
                                            <i className="far fa-trash-alt"></i>
                                        </a>
                                    </td>
                                </tr>
                            })
                        }
                    </tbody>
                </table>

            </Grid>



        </>
    );
}

export default Contacts;