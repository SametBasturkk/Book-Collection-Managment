import { render } from "@testing-library/react";
import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Card, Carousel } from 'react-bootstrap';
import { Select, message, Upload, Checkbox } from 'antd';






var isOwner;
let collectionID;

var collection = [];




const handleChangeBox = (e) => {
    console.log(e.target.value);
    if (e.target.checked && collection.indexOf(e.target.value) === -1) {
        collection.push(e.target.value);
    }

    if (!e.target.checked && collection.indexOf(e.target.value) !== -1) {
        collection.splice(collection.indexOf(e.target.value), 1);
    }
}


const CollectionInfo = () => {
    const [collection, setCollection] = useState({});
    var userid = localStorage.getItem("userId");

    useEffect(() => {
        collectionID = window.location.pathname.split(":")[1];

        fetch("http://localhost:3001/api/collectioninfo/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                id: collectionID,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                userid = data.ownerOfCollection;
                setCollection(data);
            }).then(() => {
                if (userid === localStorage.getItem("userId") || localStorage.getItem("userRole") === "admin") {
                    console.log("user is owner");
                    isOwner = true;
                    render(
                        <div>
                            {isOwner === true ?
                                <div>
                                    <EditModal />

                                    <button onClick={removeCollection}>Delete</button>
                                </div> : <p></p>}</div>
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

            {Object.keys(collection).length > 0 ? <div>
                <h1>{collection.collectionName}</h1>
                <p>{collection.description}</p>
                {collection.collectionItemsID.map(function (itemID) {
                    var itemIDLink = itemID.split("-")[1];
                    var itemIDName = itemID.split("-")[0];
                    console.log(itemIDLink);
                    console.log(itemIDName);
                    return <a id={itemIDLink} href={`/item:${itemIDLink}`}>{itemIDName}<br></br></a>
                })}
            </div> : <p>Loading...</p>}
        </div>




    );
}

const removeCollection = () => {
    fetch("http://localhost:3001/api/removeCollection/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: collectionID,
        })
    })

    return (
        alert("Collection deleted")
    )

}


const ItemCollection = () => {
    const [item, setItem] = useState({});


    useEffect(() => {
        fetch("http://localhost:3001/api/itemList/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                userId: localStorage.getItem("userId"),
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setItem(data);
            });
    }, []);
    return (
        <>{item && Object.keys(item).length > 0 && (
            item.map((item) => (
                <div>
                    <Checkbox value={item.id} onChange={handleChangeBox}>{item.itemName} - {item.id}</Checkbox>
                </div>

            ))

        )}</>
    );

}

const editCollection = () => {
    fetch("http://localhost:3001/api/editCollection/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({
            id: collectionID,
            collectionName: document.getElementById("collectionName").value,
            collectionItemsID: collection,
        })
    })
    return (
        alert("Collection edited")
    )
}


const EditModal = () => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);



    return (
        <>


            <div>
                <button onClick={handleShow}>Edit</button></div>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Collections</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <ItemCollection />
                    <form>
                        <div>
                            <br></br>
                            <br></br>
                            <label>Collection Name</label>
                            <input type="text" id="collectionName" />
                            <br></br>
                            <br></br>
                            <label>Collection Description</label>
                            <input type="text" id="collectionDescp" />
                        </div>
                    </form>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={editCollection} >
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

        </>
    );
}





const collectionDetails = () => {



    return (
        <div>
            <CollectionInfo />



        </div>

    )
}


export default collectionDetails;