import React, { useState } from "react";

import { Card, Modal, Button } from 'react-bootstrap';
import { TagCloud } from 'react-tagcloud'
import { CommentSection } from 'react-comments-section'
import 'react-comments-section/dist/index.css'
import { useAuth0 } from "@auth0/auth0-react";




var ItemName;


const Landing = () => {
    const { user } = useAuth0();


    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const data = [
        { value: 'JavaScript', count: 38 },
        { value: 'React', count: 30 },
        { value: 'Nodejs', count: 28 },
        { value: 'Express.js', count: 25 },
        { value: 'HTML5', count: 33 },
        { value: 'MongoDB', count: 18 },
        { value: 'CSS3', count: 20 },
    ]

    const dataComments = [
        {
            userId: '01a',
            comId: '012',
            fullName: 'Riya Negi',
            avatarUrl: 'https://ui-avatars.com/api/name=Riya&background=random',
            userProfile: 'https://www.linkedin.com/in/riya-negi-8879631a9/',
            text: 'Hey, Loved your blog! ',
            replies: [
                {
                    userId: '02a',
                    comId: '013',
                    userProfile: 'https://www.linkedin.com/in/riya-negi-8879631a9/',
                    fullName: 'Adam Scott',
                    avatarUrl: 'https://ui-avatars.com/api/name=Adam&background=random',
                    text: 'Thanks! It took me 1 month to finish this project but I am glad it helped out someone!🥰'
                }
            ]
        }
    ]



    return (
        <div className="Landing">
            <h1>Latest Items</h1>
            <a onClick={handleShow}>
                <Card style={{ width: '18rem' }}>
                    <Card.Img variant="top" src="holder.js/100px180" />
                    <Card.Body>
                        <Card.Title>Card Title</Card.Title>
                        <Card.Text>
                            Some quick example text to build on the card title and make up the bulk of
                            the card's content.
                        </Card.Text>
                        <Card.Title>4 Item</Card.Title>
                    </Card.Body>
                </Card>
            </a>
            <h1>Largest Collections</h1>
            <a onClick={handleShow}>
                <Card style={{ width: '18rem' }}>
                    <Card.Img variant="top" src="holder.js/100px180" />
                    <Card.Body>
                        <Card.Title>Card Title</Card.Title>
                        <Card.Text>
                            Some quick example text to build on the card title and make up the bulk of
                            the card's content.
                        </Card.Text>
                        <Card.Title>4 Item</Card.Title>
                    </Card.Body>
                </Card>
            </a>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Item Name : {ItemName}</Modal.Title>
                </Modal.Header>
                <Modal.Body>Woohoo, you're reading this text in a modal!
                    <CommentSection
                        currentUser={user ? {
                            currentUserId: { user },
                            currentUserImg:
                                'https://ui-avatars.com/api/name=Riya&background=random',
                            currentUserProfile:
                                'https://www.linkedin.com/in/riya-negi-8879631a9/',
                            currentUserFullName: 'Riya Negi'
                        } : null}
                        logIn={{
                            loginLink: 'http://localhost:3001/',
                            signupLink: 'http://localhost:3001/'
                        }}
                        commentData={dataComments}
                    />




                </Modal.Body>


                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
            <h1>Tag Cloud</h1>
            <TagCloud
                minSize={12}
                maxSize={35}
                tags={data}
                className="simple-cloud"
                onClick={(tag) => alert(`'${tag.value}' was selected!`)}
            />


        </div>
    );
}
export default Landing;