import React, { useEffect, useState, } from 'react';

import { Button, Modal, Form, Card, Carousel } from 'react-bootstrap';
import { Select, message, Upload, Checkbox } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";



import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'

import { useAuth0 } from "@auth0/auth0-react";
import { Last } from 'react-bootstrap/esm/PageItem';
import Item from 'antd/lib/list/Item';

import ItemTable from './itemTable.js';

var imagePath, data;



const submit = () => {
    fetch('http://localhost:3001/api/itemCreate/', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body: JSON.stringify({
            userId: localStorage.getItem("userId"),
            itemName: document.getElementById("itemName").value,
            tag,
            imagePath: imagePath,
        })
    })
}


const collectionCreate = () => {
    fetch('http://localhost:3001/api/collectionCreate/', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body: JSON.stringify({
            userId: localStorage.getItem("userId"),
            collectionName: document.getElementById("collectionName").value,
            collectionItemsID: collection,
        })
    })

}

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


const tag = [];

const handleChange = (value) => {
    tag.push(value[value.length - 1]);
}

//bugfix same name override
const props = {
    name: 'file',
    action: 'http://localhost:3001/image/',
    method: 'POST',
    headers: {
        authorization: 'authorization-text',
    },

    onChange(info) {
        if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
        }

        if (info.file.status === 'done') {
            imagePath = info.file.name;
            message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    },
};




const ItemList = () => {
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
                    <Link to={{
                        pathname: '/item:' + item.id,
                    }} >
                        <Card style={{ width: '18rem' }}>
                            <Card.Img variant="top" src={`/images/${item.itemImagePath}`} />
                            <Card.Body>
                                <Card.Title>{item.itemName}</Card.Title>
                                <Card.Text>
                                    {item.tags}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Link>
                </div>

            ))

        )}</>
    );
}

const CollectionList = () => {
    const [collection, setCollection] = useState({});

    useEffect(() => {
        fetch("http://localhost:3001/api/collectionList/", {
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
                setCollection(data);
            }
            );
    }, []);
    return (
        <>{collection && Object.keys(collection).length > 0 && (
            collection.map((collection) => (
                <div>
                    <Link to={{
                        pathname: '/collection:' + collection.id,
                        state: collection.id,
                    }} >
                        <Card style={{ width: '18rem' }}>
                            <Card.Img variant="top" src={`/images/${collection.collectionImagePath}`} />
                            <Card.Body>
                                <Card.Title>{collection.collectionName}</Card.Title>
                                <Card.Text>
                                    {collection.collectionItemsID}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Link>
                </div>

            ))

        )}</>
    );
}







const ItemCollection = () => {
    var index = 0;
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
                <Checkbox value={item.itemName + "-" + item.id} onChange={handleChangeBox}>{item.itemName}</Checkbox>
            ))

        )}</>
    );
}






const Collections = () => {
    const { isAuthenticated } = useAuth0();

    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);
    const [show3, setShow3] = useState(false);
    const [show4, setShow4] = useState(false);



    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleShow2 = () => setShow2(true);
    const handleClose2 = () => setShow2(false);

    const handleShow3 = () => setShow3(true);
    const handleClose3 = () => setShow3(false);


    const handleShow4 = () => setShow4(true);
    const handleClose4 = () => setShow4(false);









    return (
        isAuthenticated && (
            <div className="Landing">
                <h2 >Your Collections</h2>
                <CollectionList />
                <h2>Your Items</h2>
                <div id='cards'>
                    <ItemList />
                </div>

                <Button onClick={handleShow3}>Add Collection</Button>
                <Button onClick={handleShow}>Add Item</Button>

                {/* Modal Collections */}

                <Modal show={show4} onHide={handleClose4}>
                    <Modal.Header closeButton>
                        <Modal.Title>Selected Item</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose4}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Modal Collections */}


                <Modal show={show2} onHide={handleClose2}>
                    <Modal.Header closeButton>
                        <Modal.Title>Collections</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose2}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={submit}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>
                {/* Modal Collections */}

                <Modal show={show3} onHide={handleClose3}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Collections</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <ItemCollection />
                        <form onSubmit={submit}>
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
                        <Button variant="secondary" onClick={handleClose3}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={collectionCreate}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Modal AddItem */}

                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Item</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form>
                            <div className="form-group">
                                <label htmlFor="exampleInputEmail1">Item Name</label>
                                <input type="email" className="form-control" id="itemName"
                                    aria-describedby="emailHelp" placeholder="  " />
                                <label htmlFor="exampleInputEmail1">Tags</label>
                                <Select
                                    mode="tags"
                                    id="tags"
                                    style={{
                                        width: '100%',
                                    }}
                                    onChange={handleChange}
                                >                            </Select>
                            </div>


                            <div className="form-group">
                                <label htmlFor="exampleInputEmail1">Image Upload</label>
                                <br></br>
                                <Upload {...props}>
                                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                                </Upload>

                            </div>


                        </form>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={submit}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>
                <ItemTable />
            </div>

        )
    );
}
export default Collections;