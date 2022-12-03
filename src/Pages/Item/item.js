import { render } from "@testing-library/react";
import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Card, Carousel } from 'react-bootstrap';
import { Routes, Route, useParams } from 'react-router-dom';
import { Select, message, Upload, Checkbox } from 'antd';



var userid, isOwner;

var itemID = Number(window.location.pathname.split(":")[1]);



const tag = [];

const handleChange = (value) => {
    tag.push(value[value.length - 1]);
    console.log(tag)

}




const removeItem = () => {
    var itemID = Number(window.location.pathname.split(":")[1]);

    console.log(itemID);
    fetch("http://localhost:3001/api/removeItem/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: itemID,
        })
    })


}

const editItem = () => {
    var newName = document.getElementById("itemName").value;
    fetch("http://localhost:3001/api/updateItem/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: itemID,
            itemName: newName,
            tags: tag,

        })
    })

}


const ItemPage = () => {
    const [item, setItem] = useState({});

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        let id = window.location.pathname.split(":")[1];

        fetch("http://localhost:3001/api/iteminfo/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                id: id,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                userid = data.userID;
                setItem(data);
            }).then(() => {
                if (userid === localStorage.getItem("userId") || localStorage.getItem("userRole") === "admin") {
                    console.log("user is owner");
                    isOwner = true;
                    render(
                        <div>
                            {isOwner === true ? <div>


                                <button onClick={removeItem}>Delete</button>
                                <button onClick={handleShow}>Edit</button>



                            </div> : <p></p>}


                        </div>

                    )
                }
                else {
                    console.log("user is not owner");
                    isOwner = false;
                }
            });
    }, [])
    return (

        <div>
            <h1>{item.itemName}</h1>
            <img src={`/images/${item.itemImagePath}`} alt="item" />
            <p>{item.tags}</p>


            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Item</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <div className="form-group">
                            <label htmlFor="exampleInputEmail1">Item Name</label>
                            <input type="email" className="form-control" id="itemName"
                                aria-describedby="emailHelp" placeholder={item.itemName} />
                            <label htmlFor="exampleInputEmail1">Tags</label>
                            <Select
                                mode="tags"
                                id="tags"
                                style={{
                                    width: '100%',
                                }}
                                onChange={handleChange}
                                placeholder={item.tags}
                            >                       </Select>
                        </div>


                    </form>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={editItem} >
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>



    );
}





const Item = () => {



    return (
        <div>
            <h1>Item</h1>
            <ItemPage />

        </div>

    )
}


export default Item;