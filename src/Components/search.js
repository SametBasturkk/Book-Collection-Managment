import React, { useEffect } from 'react';
import { AutoComplete } from 'antd';



const options = [


];

fetch("http://localhost:3001/api/searchbox/", {
    method: "GET",
    headers: {
        "Content-Type": "application/json"
    }
})
    .then(res => res.json())
    .then(data => {
        data = data.map(item => {
            item.map(item => {
                console.log(item);
                options.push({
                    value: item.itemName ? "item: " + item.itemName + " - " + item.id : "collection: " + item.collectionName + " - " + item.id,
                })
                console.log(options);

            }
            )
        }
        )


    }
    )

const searchSubmit = () => {
    var value = document.getElementById("search").value;
    console.log(value);
    if (value.includes("item:")) {
        console.log("item");
        var itemId = value.split("-")[1];
        var url = "/item:" + itemId;
        var noSpacesString = url.replace(/ /g, '');
        window.location.href = noSpacesString

    }
    else if (value.includes("collection:")) {
        console.log("collection:");
        var collectionId = value.split("-")[1];
        var url = "/collection:" + collectionId;
        var noSpacesString = url.replace(/ /g, '');
        window.location.href = noSpacesString
    }
    else {
        console.log("no match");
    }


}







const Search = () => (
    <div>
        <AutoComplete
            id='search'
            style={{
                width: 200,
            }}
            options={options}
            placeholder="Search Collection or Item"
            filterOption={(inputValue, option) =>
                option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
            }
        />
        <button type="button" onClick={searchSubmit}>Search</button>
    </div>
);

export default Search;