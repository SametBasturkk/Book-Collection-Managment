var express = require("express");
const cors = require("cors");
const { Sequelize, DataTypes } = require('sequelize');


const { Pool, Client } = require("pg");
const { json } = require("express/lib/response");
const multer = require('multer');
const { ARRAY } = require("sequelize");
const { response } = require("express");


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    },
})

const upload = multer({ storage: storage })



var app = express();

app.use(express.json());
app.use(cors());

//connection to postgresql

const user = 'x'
const host = 'x'
const database = 'x'
const password = 'x?'
const port = 'x'


const sequelize = new Sequelize(database, user, password, {
    host,
    port,
    dialect: 'postgres',
    logging: false
})



//database creation
const User = sequelize.define('User', {
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userRole: {
        type: DataTypes.STRING,
        defaultValue: 'user'
    },
    userID: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
});

const Item = sequelize.define('Item', {
    itemName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    itemImagePath: {
        type: DataTypes.STRING,
        allowNull: true
    },
    category: {
        type: DataTypes.STRING,
        allowNull: true
    },
    userID: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    tags: {
        type: ARRAY(DataTypes.STRING),
        allowNull: true,
    }
}, {
});

const Collections = sequelize.define('Collections', {
    collectionName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    collectionItemsID: {
        type: ARRAY(DataTypes.STRING),
        allowNull: true,
    },
    ownerOfCollection: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
});



try {
    sequelize.authenticate();
    console.log('Connection has been established successfully.');
    sequelize.sync()
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

//services


//file upload


app.post('/image', upload.single('file'), function (req, res) {
    res.json({})
})


//get user id from auth0 if not exist add to our database for create collections and items
app.post("/api/users", async (req, res) => {
    console.log(req.body);
    userId = req.body.userId;
    userName = req.body.userName;

    const user = await User.findOne({
        where: {
            userID: userId
        }

    }).then(user => {
        if (user) {
            console.log("user exists");
        } else {
            console.log("user does not exist");
            User.create({
                userID: userId,
                firstName: userName,
                userRole: 'user'
            })
        }

        if (user.userRole === 'user') {
            res.json({
                userRole: 'user'
            })
        }
        else {
            res.json({
                userRole: 'admin'
            })
        }

    })


});

app.post("/api/itemCreate", async (req, res) => {
    console.log(req.body);
    userId = req.body.userId;
    itemName = req.body.itemName;
    tagIt = req.body.tag;
    imagePath = req.body.imagePath;
    console.log(tagIt);
    Item.create({
        userID: userId,
        itemName: itemName,
        itemImagePath: imagePath,
        tags: tagIt
    })
    console.log("item created" + itemName);
}
);


app.post("/api/itemList", async (req, res) => {
    userId = req.body.userId;
    console.log(userId);


    const items = await Item.findAll({
        where: {
            userID: userId
        }
    }).then(items => {
        res.json(items)
    }
    )
}
);


app.post("/api/collectionCreate", async (req, res) => {
    userId = req.body.userId;
    collectionName = req.body.collectionName;
    collectionItemsID = req.body.collectionItemsID;
    console.log(userId, collectionName, collectionItemsID);

    Collections.create({
        ownerOfCollection: userId,
        collectionName: collectionName,
        collectionItemsID: collectionItemsID
    })
    console.log("collection created" + collectionName);
}
);

app.post("/api/collectionList", async (req, res) => {
    userId = req.body.userId;

    const collections = await Collections.findAll({
        where: {
            ownerOfCollection: userId
        }
    }).then(collections => {
        res.json(collections)
    }
    )
}
);



app.post("/api/iteminfo", async (req, res) => {
    console.log(req.body);
    itemId = req.body.id;

    const item = await Item.findOne({
        where: {
            id: itemId,

        }
    }).then(item => {
        res.json(item)
    }
    )
});

app.post("/api/collectioninfo", async (req, res) => {
    console.log(req.body);
    collectionId = req.body.id;


    const collection = await Collections.findOne({
        where: {
            id: collectionId,

        }
    }).then(collection => {
        res.json(collection)
    }
    )
}
);


app.post("/api/removeItem", async (req, res) => {
    console.log(req.body);
    itemId = req.body.id;


    const item = await Item.destroy({
        where: {
            id: itemId,
        }
    }).then(item => {
        res.json(item)
    }
    )

}
);

app.post("/api/removeCollection", async (req, res) => {
    console.log(req.body);
    collectionId = req.body.id;


    const collection = await Collections.destroy({
        where: {
            id: collectionId,
        }
    }).then(collection => {
        res.json(collection)
    }
    )

    console.log("collection deleted" + collectionId);
}
);

app.post("/api/updateItem", async (req, res) => {
    console.log(req.body);
    itemId = req.body.id;
    itemName = req.body.itemName;
    tagIt = req.body.tags;


    const item = await Item.update({
        itemName: itemName,
        tags: tagIt
    }, {
        where: {
            id: itemId,
        }
    }).then(item => {
        res.json(item)
    }
    )
}
);

app.post("/api/editCollection", async (req, res) => {
    console.log(req.body);
    collectionId = req.body.id;
    collectionName = req.body.collectionName;
    collectionItemsID = req.body.collectionItemsID;


    const collection = await Collections.update({
        collectionName: collectionName,
        collectionItemsID: collectionItemsID
    }, {
        where: {
            id: collectionId,
        }
    }).then(collection => {
        res.json(collection)
    }
    )
}
);





app.get("/api/searchbox", async (req, res) => {

    let response = [];


    console.log("All items and collections");

    const items = await Item.findAll({
        attributes: { exclude: ['userID'] }


    }).then(items => {
        response.push(items)


    })

    const collections = await Collections.findAll({
        attributes: { exclude: ['ownerOfCollection'] }

    }
    ).then(collections => {
        response.push(collections)

    }
    )

    res.json(response)


}
);




console.log("Listening on port 3001");
app.listen(3001);
